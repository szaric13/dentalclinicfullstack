# Dental Clinic – Full-Stack Web Application

A complete web application for a dental clinic that allows patients to book appointments online, doctors to manage their schedules, and administrators to control doctors and services.

## Tech Stack

### Backend
- **Java 21** + **Spring Boot 4.0.6**
- **Spring Security** + **JWT** (two separate authentication chains – patients and doctors)
- **Spring Data JPA / Hibernate** + **MySQL**
- **JavaMailSender** + **Thymeleaf** for email notifications
- **Twilio** for SMS verification and alerts
- **JUnit 5 + MockMvc + TestRestTemplate** (27 tests)

### Frontend
- **React 19** + **Vite**
- **React Router v6**, **Axios**
- **React Big Calendar** for interactive appointment display
- Custom CSS (no libraries) with a theme inspired by a real dental clinic

## Features

### Patient
- Registration with SMS verification
- Login via phone number
- View available slots in a calendar (green = free, red = taken)
- Book, cancel and reschedule appointments
- Rate doctors (1–5 stars)
- Password reset (email or SMS)

### Doctor
- Login via email
- View own calendar with all appointments
- Confirm and cancel appointments (with patient notifications)
- View own reviews and average rating
- Set working hours with restrictions

### Admin
- Add and remove doctors
- Edit doctor specializations
- Manage holidays
- View statistics (appointment count, revenue)

### Common
- JWT authentication with refresh tokens
- Email & SMS notifications on booking, confirmation and cancellation
- Cancellation deadline (at least 24h in advance)
- Doctor–service specialization compatibility check
- Alternative dates when no slots are available

## How to Run Locally

### Backend
1. Clone the repo
2. Start MySQL and create the `dental_clinic` database
3. Run `DentalClinicApplication.java`
4. Backend runs at `http://localhost:8080`

### Frontend
1. `cd dental-frontend`
2. `npm install`
3. `npm run dev`
4. Frontend runs at `http://localhost:5173`

## Tests
- 27 automated tests (JUnit + MockMvc)
- Cover authentication, appointment CRUD, cancellation, reviews, public endpoints

## Screenshots
*(Insert screenshots of the application here)*

## License
MIT
