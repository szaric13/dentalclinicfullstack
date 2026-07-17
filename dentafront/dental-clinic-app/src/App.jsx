import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import ChatWidget from "./components/ChatWidget.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import ScrollToTop from "./components/ScrollToTop.jsx"

import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx"
import DoctorLoginPage from "./pages/DoctorLoginPage.jsx"
import PatientDashboard from "./pages/PatientDashboard.jsx"
import BookAppointment from "./pages/BookAppointment.jsx"
import DoctorDashboard from "./pages/DoctorDashboard.jsx"
import DoctorProfilePage from "./pages/DoctorProfilePage.jsx"
import ContactPage from "./pages/ContactPage.jsx"
import ServicesPage from "./pages/ServicePage.jsx"
import ServiceDetailPage from "./pages/ServiceDetailPage.jsx"
import SpecialtyPage from "./pages/SpecialtyPage.jsx"
import TeamPage from "./pages/TeamPage.jsx"
import BlogPage from "./pages/BlogPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import NursesPage from "./pages/NursePage.jsx";

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/doctor" element={<DoctorLoginPage />} />
            <Route path="/nurses" element={<NursesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/specialty/:specialty" element={<SpecialtyPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/doctor/:id" element={<DoctorProfilePage />} />
            <Route path="/profile/:slug" element={<ProfilePage />} />

            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute role="PATIENT">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book"
              element={
                <ProtectedRoute role="PATIENT">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute role="DOCTOR">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
