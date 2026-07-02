import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { storage } from "../lib/api"
import { authApi, patientApi, doctorApi } from "../lib/services"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(storage.role || null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!storage.accessToken && !!role

  const loadProfile = useCallback(async () => {
    const currentRole = storage.role
    if (!storage.accessToken || !currentRole) {
      setLoading(false)
      return
    }
    try {
      const profile = currentRole === "DOCTOR" ? await doctorApi.profile() : await patientApi.profile()
      setUser(profile)
      setRole(currentRole)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const loginPatient = async (credentials) => {
    const data = await authApi.patientLogin(credentials)
    storage.set({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: "PATIENT" })
    setRole("PATIENT")
    const profile = await patientApi.profile()
    setUser(profile)
    return data
  }

  const loginDoctor = async (credentials) => {
    const data = await authApi.doctorLogin(credentials)
    storage.set({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: "DOCTOR" })
    setRole("DOCTOR")
    const profile = await doctorApi.profile()
    setUser(profile)
    return data
  }

  const logout = async () => {
    await authApi.logout()
    storage.clear()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, role, loading, isAuthenticated, loginPatient, loginDoctor, logout, refreshProfile: loadProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
