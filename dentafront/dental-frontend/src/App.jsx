import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './pages/NavBar';
import Footer from './pages/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import BookAppointment from './pages/BookAppointment';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import TeamPage from './pages/TeamPage';
import BlogPage from './pages/BlogPage';
import SpecialtyPage from './pages/SpecialtyPage';
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

function AppShell() {
    const { pathname } = useLocation();
    // The doctor dashboard is a full-screen SaaS layout with its own chrome.
    const isDashboard = pathname.startsWith('/doctor/dashboard');

    return (
        <>
            {!isDashboard && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/book" element={<BookAppointment />} />
                <Route path="/doctor" element={<DoctorLoginPage />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/:id" element={<DoctorProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/services/specialty/:specialty" element={<SpecialtyPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/profile/:slug" element={<ProfilePage />} />
            </Routes>
            {!isDashboard && <Footer />}
        </>
    );
}
