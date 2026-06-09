import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403) {
            const refreshToken = localStorage.getItem('refreshToken');
            const role = localStorage.getItem('role');
            if (refreshToken) {
                try {
                    const endpoint = role === 'DOCTOR' ? '/auth/doctor/refresh' : '/auth/patient/refresh';
                    const res = await api.post(endpoint, { refreshToken });
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                    error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
                    return api.request(error.config);
                } catch {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;