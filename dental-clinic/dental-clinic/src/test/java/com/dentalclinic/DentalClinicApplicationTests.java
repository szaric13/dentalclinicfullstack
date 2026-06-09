package com.dentalclinic;

import com.dentalclinic.dto.*;
import com.dentalclinic.model.*;
import com.dentalclinic.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
class DentalClinicApplicationTests {

	@Autowired
	private WebApplicationContext context;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@Autowired private PasswordEncoder passwordEncoder;
	@Autowired private PatientRepository patientRepository;
	@Autowired private DoctorRepository doctorRepository;
	@Autowired private DoctorReviewRepository doctorReviewRepository;
	@Autowired private AppointmentRepository appointmentRepository;
	@Autowired private RefreshTokenRepository refreshTokenRepository;
	@Autowired private PasswordResetTokenRepository passwordResetTokenRepository;
	@Autowired private DentalServiceRepository dentalServiceRepository;
	@Autowired private DoctorWorkingHoursRepository workingHoursRepository;

	@BeforeEach
	void setUp() {
		objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		mockMvc = MockMvcBuilders.webAppContextSetup(context)
				.addFilters()
				.build();

		doctorReviewRepository.deleteAll();
		appointmentRepository.deleteAll();
		refreshTokenRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		patientRepository.deleteAll();
		workingHoursRepository.deleteAll();
		doctorRepository.deleteAll();
		dentalServiceRepository.deleteAll();
	}

	private void setSecurityContext(Long userId, String role) {
		UsernamePasswordAuthenticationToken auth =
				new UsernamePasswordAuthenticationToken(userId, null,
						List.of(new SimpleGrantedAuthority("ROLE_" + role)));
		SecurityContextHolder.getContext().setAuthentication(auth);
	}

	private void clearSecurityContext() {
		SecurityContextHolder.clearContext();
	}

	// ==================== AUTH TESTS ====================

	@Test
	void testRegisterPatient() throws Exception {
		PatientRegisterRequest req = buildRegisterRequest("0601234567", "lozinka123", "Marko", "Marković",
				"marko@example.com", LocalDate.of(1990, 5, 15), "Beleška");

		mockMvc.perform(post("/api/auth/patient/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk());
	}

	@Test
	void testRegisterDuplicatePhone() throws Exception {
		savePatient("0601234567", "lozinka123", true, true);
		PatientRegisterRequest req = buildRegisterRequest("0601234567", "lozinka123", "Marko", "Marković",
				"marko2@example.com", null, null);

		mockMvc.perform(post("/api/auth/patient/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void testVerifyPatient() throws Exception {
		Patient p = Patient.builder().phone("0635556666").password("x").firstName("Ana").lastName("Anić")
				.email("ana@example.com").verificationCode("123456")
				.verificationCodeExpiry(LocalDateTime.now().plusMinutes(5))
				.verified(false).active(false).deleted(false).build();
		patientRepository.save(p);

		PatientVerifyRequest req = new PatientVerifyRequest();
		req.setPhone("0635556666");
		req.setCode("123456");

		mockMvc.perform(post("/api/auth/patient/verify")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk());
	}

	@Test
	void testLoginPatient() throws Exception {
		savePatient("0619876543", "mojasifra", true, true);

		PatientLoginRequest req = new PatientLoginRequest();
		req.setPhone("0619876543");
		req.setPassword("mojasifra");

		mockMvc.perform(post("/api/auth/patient/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accessToken").isNotEmpty())
				.andExpect(jsonPath("$.refreshToken").isNotEmpty());
	}

	@Test
	void testLoginDoctor() throws Exception {
		Doctor doctor = Doctor.builder().firstName("Dušica").lastName("Kotarac")
				.email("dusica@test.com").password(passwordEncoder.encode("doktor123"))
				.specialization("Ortodoncija").active(true).deleted(false).build();
		doctorRepository.save(doctor);

		DoctorLoginRequest req = new DoctorLoginRequest();
		req.setEmail("dusica@test.com");
		req.setPassword("doktor123");

		mockMvc.perform(post("/api/auth/doctor/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accessToken").isNotEmpty());
	}

	@Test
	void testResendVerification() throws Exception {
		Patient p = Patient.builder().phone("0601111111").password("x").firstName("x").lastName("x")
				.email("x@x.com").verified(false).active(false).deleted(false).build();
		patientRepository.save(p);

		mockMvc.perform(post("/api/auth/patient/resend-verification")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"phone\":\"0601111111\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void testForgotPasswordEmail() throws Exception {
		Patient p = savePatient("0612222222", "x", true, true);
		p.setEmail("test@test.com");
		patientRepository.save(p);

		mockMvc.perform(post("/api/auth/patient/forgot-password")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"test@test.com\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void testResetPassword() throws Exception {
		Patient p = savePatient("0613333333", "x", true, true);
		PasswordResetToken token = PasswordResetToken.builder()
				.patient(p).token("abc123").expiryDate(LocalDateTime.now().plusHours(1)).used(false).build();
		passwordResetTokenRepository.save(token);

		mockMvc.perform(post("/api/auth/patient/reset-password")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"token\":\"abc123\",\"newPassword\":\"nova123\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void testForgotPasswordPhone() throws Exception {
		savePatient("0614444444", "x", true, true);

		mockMvc.perform(post("/api/auth/patient/forgot-password-phone")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"phone\":\"0614444444\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void testResetPasswordPhone() throws Exception {
		Patient p = savePatient("0615555555", "x", true, true);
		p.setVerificationCode("654321");
		p.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
		patientRepository.save(p);

		mockMvc.perform(post("/api/auth/patient/reset-password-phone")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"phone\":\"0615555555\",\"code\":\"654321\",\"newPassword\":\"nova123\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void testLogout() throws Exception {
		mockMvc.perform(post("/api/auth/logout")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"refreshToken\":\"nepostojeći\"}"))
				.andExpect(status().isBadRequest());
	}

	// ==================== PACIJENT TESTS ====================

	@Test
	void testGetPatientProfile() throws Exception {
		Patient p = savePatient("0616666666", "lozinka", true, true);
		setSecurityContext(p.getId(), "PATIENT");

		mockMvc.perform(get("/api/patient/profile"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.phone").value("0616666666"));

		clearSecurityContext();
	}

	@Test
	void testGetPatientAppointments() throws Exception {
		Patient p = savePatient("0617777777", "lozinka", true, true);
		setSecurityContext(p.getId(), "PATIENT");

		mockMvc.perform(get("/api/patient/appointments"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());

		clearSecurityContext();
	}

	@Test
	void testCancelAppointmentByPatient() throws Exception {
		Patient p = savePatient("0618888888", "lozinka", true, true);
		Doctor d = saveDoctor("dr@test.com", "doktor123", "Opšta");
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Appointment app = saveAppointment(p, d, s, LocalDateTime.now().plusDays(30));
		setSecurityContext(p.getId(), "PATIENT");

		mockMvc.perform(delete("/api/patient/appointments/" + app.getId()))
				.andExpect(status().isOk());

		clearSecurityContext();
	}

	@Test
	void testRescheduleAppointment() throws Exception {
		Patient p = savePatient("0619999999", "lozinka", true, true);
		Doctor d = saveDoctor("dr2@test.com", "doktor123", "Opšta");
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Appointment app = saveAppointment(p, d, s, LocalDateTime.now().plusDays(30));
		setSecurityContext(p.getId(), "PATIENT");

		RescheduleRequest req = new RescheduleRequest();
		req.setNewStartDateTime(LocalDateTime.now().plusDays(35));

		mockMvc.perform(put("/api/patient/appointments/" + app.getId() + "/reschedule")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk());

		clearSecurityContext();
	}

	// ==================== DOCTOR TESTS ====================

	@Test
	void testGetDoctorProfile() throws Exception {
		Doctor d = saveDoctor("dr3@test.com", "doktor123", "Hirurgija");
		setSecurityContext(d.getId(), "DOCTOR");

		mockMvc.perform(get("/api/doctor/profile"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("dr3@test.com"));

		clearSecurityContext();
	}

	@Test
	void testGetDoctorAppointments() throws Exception {
		Doctor d = saveDoctor("dr4@test.com", "doktor123", "Hirurgija");
		setSecurityContext(d.getId(), "DOCTOR");

		mockMvc.perform(get("/api/doctor/appointments"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());

		clearSecurityContext();
	}

	@Test
	void testConfirmAppointment() throws Exception {
		Doctor d = saveDoctor("dr5@test.com", "doktor123", "Opšta");
		Patient p = savePatient("0620000000", "lozinka", true, true);
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Appointment app = saveAppointment(p, d, s, LocalDateTime.now().plusDays(30));
		setSecurityContext(d.getId(), "DOCTOR");

		mockMvc.perform(put("/api/doctor/appointments/" + app.getId() + "/confirm"))
				.andExpect(status().isOk());

		clearSecurityContext();
	}

	@Test
	void testCancelAppointmentByDoctor() throws Exception {
		Doctor d = saveDoctor("dr6@test.com", "doktor123", "Opšta");
		Patient p = savePatient("0621111111", "lozinka", true, true);
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Appointment app = saveAppointment(p, d, s, LocalDateTime.now().plusDays(30));
		setSecurityContext(d.getId(), "DOCTOR");

		mockMvc.perform(delete("/api/doctor/appointments/" + app.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"reason\":\"test\"}"))
				.andExpect(status().isOk());

		clearSecurityContext();
	}

	// ==================== APPOINTMENT TESTS ====================

	@Test
	void testGetAvailableSlots() throws Exception {
		Doctor d = saveDoctor("dr7@test.com", "doktor123", "Opšta");
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Patient p = savePatient("0622222222", "lozinka", true, true);
		setSecurityContext(p.getId(), "PATIENT");

		LocalDate monday = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
		mockMvc.perform(get("/api/patient/available-slots")
						.param("doctorId", d.getId().toString())
						.param("serviceId", s.getId().toString())
						.param("date", monday.toString()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());

		clearSecurityContext();
	}

	@Test
	void testBookAppointment() throws Exception {
		Doctor d = saveDoctor("dr8@test.com", "doktor123", "Opšta");
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Patient p = savePatient("0623333333", "lozinka", true, true);
		setSecurityContext(p.getId(), "PATIENT");

		LocalDate monday = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
		AppointmentRequest req = new AppointmentRequest();
		req.setDoctorId(d.getId());
		req.setServiceId(s.getId());
		req.setStartDateTime(LocalDateTime.of(monday, LocalTime.of(8, 0)));
		req.setPatientNotes("Beleška");

		mockMvc.perform(post("/api/patient/appointments")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("SCHEDULED"));

		clearSecurityContext();
	}

	@Test
	void testGetAlternativeDates() throws Exception {
		Doctor d = saveDoctor("dr9@test.com", "doktor123", "Opšta");
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Patient p = savePatient("0624444444", "lozinka", true, true);
		setSecurityContext(p.getId(), "PATIENT");

		LocalDate monday = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
		mockMvc.perform(get("/api/patient/alternative-dates")
						.param("doctorId", d.getId().toString())
						.param("serviceId", s.getId().toString())
						.param("fromDate", monday.toString()))
				.andExpect(status().isOk());

		clearSecurityContext();
	}

	// ==================== PUBLIC TESTS ====================

	@Test
	void testGetPublicDoctors() throws Exception {
		saveDoctor("public@test.com", "x", "Opšta");

		mockMvc.perform(get("/api/public/doctors"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));
	}

	@Test
	void testGetPublicServices() throws Exception {
		saveService("Usluga1", 30, "Opšta");

		mockMvc.perform(get("/api/public/services"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));
	}

	// ==================== REVIEW TESTS ====================

	@Test
	void testAddReview() throws Exception {
		Doctor d = saveDoctor("review@test.com", "doktor123", "Opšta");
		Patient p = savePatient("0625555555", "lozinka", true, true);
		DentalService s = saveService("Pregled", 30, "Opšta");
		saveWorkingHours(d, 1, LocalTime.of(8, 0), LocalTime.of(16, 0));
		Appointment app = saveAppointment(p, d, s, LocalDateTime.now().plusDays(30));
		app.setStatus(Appointment.AppointmentStatus.CONFIRMED);
		appointmentRepository.save(app);
		setSecurityContext(p.getId(), "PATIENT");

		mockMvc.perform(post("/api/reviews/doctors/" + d.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"appointmentId\":" + app.getId() + ",\"rating\":5,\"comment\":\"Odličan\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(5));

		clearSecurityContext();
	}

	@Test
	void testGetReviews() throws Exception {
		Doctor d = saveDoctor("review2@test.com", "doktor123", "Opšta");

		mockMvc.perform(get("/api/reviews/doctors/" + d.getId()))
				.andExpect(status().isOk());
	}

	@Test
	void testGetAverageRating() throws Exception {
		Doctor d = saveDoctor("review3@test.com", "doktor123", "Opšta");

		mockMvc.perform(get("/api/reviews/doctors/" + d.getId() + "/average"))
				.andExpect(status().isOk());
	}

	// ==================== POMOĆNE METODE ====================

	private Patient savePatient(String phone, String password, boolean active, boolean verified) {
		Patient p = Patient.builder()
				.phone(phone).password(passwordEncoder.encode(password))
				.firstName("Ime").lastName("Prezime")
				.email(phone + "@test.com")
				.active(active).verified(verified).deleted(false).build();
		return patientRepository.save(p);
	}

	private PatientRegisterRequest buildRegisterRequest(String phone, String pass, String fn, String ln,
														String email, LocalDate dob, String notes) {
		PatientRegisterRequest r = new PatientRegisterRequest();
		r.setPhone(phone);
		r.setPassword(pass);
		r.setFirstName(fn);
		r.setLastName(ln);
		r.setEmail(email);
		r.setDateOfBirth(dob);
		r.setNotes(notes);
		return r;
	}

	private Doctor saveDoctor(String email, String password, String specialization) {
		Doctor d = Doctor.builder()
				.firstName("Dr").lastName("Test")
				.email(email).password(passwordEncoder.encode(password))
				.specialization(specialization).active(true).deleted(false).build();
		return doctorRepository.save(d);
	}

	private DentalService saveService(String name, int duration, String specialization) {
		DentalService s = DentalService.builder()
				.name(name).durationMinutes(duration).specialization(specialization)
				.active(true).deleted(false).build();
		return dentalServiceRepository.save(s);
	}

	private void saveWorkingHours(Doctor d, int dayOfWeek, LocalTime start, LocalTime end) {
		workingHoursRepository.save(DoctorWorkingHours.builder()
				.doctor(d).dayOfWeek(dayOfWeek).startTime(start).endTime(end).build());
	}

	private Appointment saveAppointment(Patient p, Doctor d, DentalService s, LocalDateTime start) {
		Appointment a = Appointment.builder()
				.patient(p).doctor(d).service(s)
				.startDateTime(start).endDateTime(start.plusMinutes(s.getDurationMinutes()))
				.status(Appointment.AppointmentStatus.SCHEDULED).build();
		return appointmentRepository.save(a);
	}
}