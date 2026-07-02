import axios from "axios"

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
export const storage = {
  get accessToken() {
    return localStorage.getItem("accessToken")
  },
  get refreshToken() {
    return localStorage.getItem("refreshToken")
  },
  get role() {
    return localStorage.getItem("role")
  },
  set({ accessToken, refreshToken, role }) {
    if (accessToken) localStorage.setItem("accessToken", accessToken)
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
    if (role) localStorage.setItem("role", role)
  },
  clear() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("role")
  },
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = storage.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue = []

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  pendingQueue = []
}

function handleLogout() {
  storage.clear()
  if (window.location.pathname !== "/login") {
    window.location.href = "/login"
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // Only attempt refresh on 403 for protected (non-auth) requests
    const isAuthEndpoint = original?.url?.includes("/auth/")

    if (status === 403 && !original._retry && !isAuthEndpoint) {
      const role = (storage.role || "patient").toLowerCase()
      const refreshToken = storage.refreshToken

      if (!refreshToken) {
        handleLogout()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${API_BASE}/auth/${role}/refresh`, { refreshToken })
        storage.set({ accessToken: data.accessToken, refreshToken: data.refreshToken })
        processQueue(null, data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        handleLogout()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
