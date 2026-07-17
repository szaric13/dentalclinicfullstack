# Dental Clinic Management System

A production-ready full-stack web application developed for a real dental clinic to streamline appointment scheduling, patient management, and doctor workflows.

The application provides secure authentication, intelligent appointment scheduling, automated notifications, and role-based access control for patients, doctors, and administrators.

**Live Demo:** [dentalclinicfullstack.onrender.com](https://dentalclinicfullstack.onrender.com)  
**Dockerfile:** [Dockerfile](https://github.com/szaric13/dentalclinicfullstack/blob/main/Dockerfile)

---

## Tech Stack

### Backend
- Java 21
- Spring Boot 4
- Spring Security
- JWT Authentication + Refresh Tokens
- Spring Data JPA / Hibernate
- MySQL
- Twilio API
- JavaMailSender
- Thymeleaf
- JUnit 5
- MockMvc

### Frontend
- React 19
- Vite
- React Router
- Axios
- React Big Calendar
- Tailwind CSS

### DevOps & Deployment
- Docker (multi-stage build for frontend + backend)
- GitHub Actions (CI/CD pipeline – automated build & tests)
- Render (cloud deployment)

---

## Key Features

*(ostavljam sve isto kao u originalu, ispod su samo ključne tačke bez izmena)*

### Authentication
- JWT authentication with refresh tokens
- Separate authentication flows for Patients and Doctors
- SMS and Email verification
- Password reset via Email or SMS

### Appointment Management
- Real-time appointment scheduling
- Automatic slot calculation
- Working hours and break management
- Holiday support
- Rescheduling and cancellation
- 24-hour cancellation policy
- Alternative appointment suggestions

### Doctor Portal
- Appointment management
- Availability management
- Patient reviews
- Average rating

### Administration
- Doctor management
- Service management
- Holiday management
- Dashboard with appointment and revenue statistics

### Notifications
- Booking confirmation
- Cancellation
- Appointment confirmation
- SMS & Email delivery

---

## Testing

- **30+ automated integration tests**
- Authentication flows
- Booking and cancellation logic
- Reviews
- Public API endpoints

---

## Future Improvements

- Swagger/OpenAPI documentation
- Redis caching
- Role-based admin dashboard
- End-to-end (E2E) tests
