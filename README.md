# Dental Clinic Management System

A full-stack web application developed for a real dental clinic to streamline appointment scheduling, patient management, and service administration.  
**Two frontend implementations** (React and Vue) share the same Spring Boot backend.

## Features
- Online appointment booking, rescheduling, and cancellation (24h deadline)
- Real‑time available time slot calculation based on doctor's working hours, breaks, and service duration  
- **Alternative date suggestion** – when a slot is full, system offers next free days
- Doctor confirmation workflow – appointments are pending until approved
- Patient and doctor authentication with JWT + refresh tokens
- Email & SMS notifications for booking, confirmation, cancellation, and reminders
- Password recovery via email or phone (verification code)
- Service catalog with specialization matching (doctor must have required specialty)
- Doctor reviews and rating system (only after confirmed appointments)
- Responsive UI for both patients and staff (React and Vue versions)

## Tech Stack
**Backend**  
Java · Spring Boot 3 · Spring Security · JWT · JPA/Hibernate · MySQL · JUnit 5 · MockMvc · JavaMailSender · Twilio API

**Frontend**  
React · Vue.js · JavaScript · HTML5 · CSS3 · Axios

## Testing
The project includes **20+ integration tests** covering:
- Authentication (register, verify, login, password reset, refresh token)
- Appointment scheduling, rescheduling, cancellation (patient & doctor roles)
- Availability calculation and alternative dates logic
- Review creation and average rating
- Doctor/patient profile access
- Public API endpoints

All tests use `@Transactional` rollback, so no data is persisted.

This project was developed as a real‑world solution for a dental clinic, focusing on clean architecture, security, and maintainable code.
