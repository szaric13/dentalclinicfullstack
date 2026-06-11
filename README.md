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

## Izmene

### BEK-END IZMENE
- AppointmentResponse.java – dodato polje serviceId i ažuriran konstruktor sa 8 parametara.
- PatientController.java – dodato a.getService().getId() u mapiranje za getMyAppointments.
- DoctorController.java – dodato app.getService().getId() u createManualAppointment i getMyAppointments.
- AppointmentController.java – dodato app.getService().getId() u bookAppointment.
- AppointmentService.java – dodata metoda autoCompletePastAppointments() sa @Scheduled za automatsko poništavanje prošlih termina.
- AppointmentRepository.java – dodata metoda findByStatusAndEndDateTimeBefore.
- DentalClinicApplication.java – dodata anotacija @EnableScheduling.
- SecurityConfig.java – dodato .requestMatchers(HttpMethod.GET, "/api/reviews/doctors/**").permitAll().
- DoctorWorkingHoursService.java – dodata validacija za radno vreme (08:00‑19:00, subota do 12:00).

### FRONT-END IZMENE
- src/components/Navbar.jsx – dodat search bar, centriran meni, dark mode dugme, jezičko dugme, uklonjen top bar.
- src/components/Footer.jsx – redizajniran sa tri kolone.
- src/components/ChatWidget.jsx – potpuno nov fajl (custom chatbot).
- src/components/PageWrapper.jsx – potpuno nov fajl (framer‑motion animacije).
- src/pages/BookAppointment.jsx – dodat modal za profil doktora, slika pored menija, popravljen kalendar.
- src/pages/PatientDashboard.jsx – modal za otkazivanje, ispravljen reschedule, ICS download, "Vaš sledeći termin" widget.
- src/pages/DoctorDashboard.jsx – radno vreme sa validacijom, ocene, ručno dodavanje termina, modal za otkazivanje.
- src/pages/HomePage.jsx – FAQ sekcija, social proof, SEO Helmet.
- src/pages/SpecialtyPage.jsx – potpuno nov fajl (leva kolona + opis).
- src/pages/ProfilePage.jsx – potpuno nov fajl (za sestre i fallback za doktore).
- src/pages/DoctorProfilePage.jsx – popravljene ocene (javno vidljive), slike, SEO.
- src/pages/ContactPage.jsx – Google Maps iframe, SEO.
- src/pages/ServicesPage.jsx – grupisanje po specijalizaciji, SEO.
- src/pages/ServiceDetailPage.jsx – SEO.
- src/pages/TeamPage.jsx – SEO.
- src/pages/BlogPage.jsx – SEO.
- src/pages/LoginPage.jsx – toast notifikacije, SEO.
- src/pages/RegisterPage.jsx – toast notifikacije, SEO.
- src/pages/ForgotPasswordPage.jsx – toast notifikacije, SEO.
- src/pages/ResetPasswordPage.jsx – toast notifikacije, SEO.
- src/pages/DoctorLoginPage.jsx – toast notifikacije, SEO.
- src/App.jsx – dodat HelmetProvider, AnimatePresence, Toaster, CookieConsent, ChatWidget.
- src/i18n.js – potpuno nov fajl.
- src/index.css – potpuno redizajniran sa CSS varijablama i dark mode‑om.
- src/main.jsx – dodat PWA service worker.
- public/manifest.json – potpuno nov fajl.
- public/service-worker.js – potpuno nov fajl.

## License
MIT
