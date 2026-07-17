import axios from "axios"
import api, { storage } from "./api"

// ---------- PUBLIC ----------
export const publicApi = {
  doctors: () => api.get("/public/doctors").then((r) => r.data),
  nurses: () => api.get("/public/nurses").then((r) => r.data),
  nurse: (id) => api.get(`/public/nurses/${id}`).then((r) => r.data),
  services: () => api.get("/public/services").then((r) => r.data),
  doctorReviews: (id) => api.get(`/reviews/doctors/${id}`).then((r) => r.data),
  doctorAverage: (id) => api.get(`/reviews/doctors/${id}/average`).then((r) => r.data),
}

// ---------- AUTH ----------
export const authApi = {
  patientRegister: (payload) => api.post("/auth/patient/register", payload).then((r) => r.data),
  patientVerify: (payload) => api.post("/auth/patient/verify", payload).then((r) => r.data),
  patientLogin: (payload) => api.post("/auth/patient/login", payload).then((r) => r.data),
  patientResend: (phone) => api.post("/auth/patient/resend-verification", { phone }).then((r) => r.data),
  patientForgotEmail: (email) => api.post("/auth/patient/forgot-password", { email }).then((r) => r.data),
  patientResetEmail: (payload) => api.post("/auth/patient/reset-password", payload).then((r) => r.data),
  patientForgotPhone: (phone) => api.post("/auth/patient/forgot-password-phone", { phone }).then((r) => r.data),
  patientResetPhone: (payload) => api.post("/auth/patient/reset-password-phone", payload).then((r) => r.data),
  doctorLogin: (payload) => api.post("/auth/doctor/login", payload).then((r) => r.data),
  logout: () => {
    const refreshToken = storage.refreshToken
    return api.post("/auth/logout", { refreshToken }).catch(() => {})
  },
}

// ---------- PATIENT ----------
export const patientApi = {
  profile: () => api.get("/patient/profile").then((r) => r.data),
  appointments: () => api.get("/patient/appointments").then((r) => r.data),
  cancel: (id) => api.delete(`/patient/appointments/${id}`).then((r) => r.data),
  reschedule: (id, newStartDateTime) =>
      api.put(`/patient/appointments/${id}/reschedule`, { newStartDateTime }).then((r) => r.data),
  availableSlots: (doctorId, serviceId, date) =>
      api
          .get("/patient/available-slots", { params: { doctorId, serviceId, date } })
          .then((r) => r.data),
  book: (payload) => api.post("/patient/appointments", payload).then((r) => r.data),
  alternativeDates: (doctorId, serviceId, fromDate) =>
      api
          .get("/patient/alternative-dates", { params: { doctorId, serviceId, fromDate } })
          .then((r) => r.data),
}

// ---------- DOCTOR ----------
export const doctorApi = {
  profile: () => api.get("/doctor/profile").then((r) => r.data),
  appointments: () => api.get("/doctor/appointments").then((r) => r.data),
  cancel: (id, reason) =>
      api.delete(`/doctor/appointments/${id}`, { data: { reason } }).then((r) => r.data),
  confirm: (id) => api.put(`/doctor/appointments/${id}/confirm`).then((r) => r.data),
  manual: (payload) => api.post("/doctor/appointments/manual", payload).then((r) => r.data),
  workingHours: (payload) => api.put("/doctor/working-hours", payload).then((r) => r.data),
}

// ---------- REVIEWS ----------
export const reviewApi = {
  create: (doctorId, payload) =>
      api.post(`/reviews/doctors/${doctorId}`, payload).then((r) => r.data),
}

export default api