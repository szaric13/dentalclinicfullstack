package com.dentalclinic.service;

import com.dentalclinic.dto.ManualAppointmentRequest;
import com.dentalclinic.model.*;
import com.dentalclinic.repository.AppointmentRepository;
import com.dentalclinic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;
    private final DoctorService doctorService;
    private final ServiceCatalogService serviceCatalogService;
    private final DoctorWorkingHoursService workingHoursService;
    private static final long CANCELLATION_DEADLINE_HOURS = 24;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SmsService smsService;

    public List<LocalDateTime> getAvailableSlots(Long doctorId, Long serviceId, LocalDate date) {
        Doctor doctor = doctorService.getById(doctorId);
        DentalService service = serviceCatalogService.getById(serviceId);
        int duration = service.getDurationMinutes();

        Optional<DoctorWorkingHours> optWH = workingHoursService.getWorkingHoursForDay(doctorId, date.getDayOfWeek());
        if (optWH.isEmpty()) {
            return List.of();
        }

        DoctorWorkingHours wh = optWH.get();
        LocalTime workStart = wh.getStartTime();
        LocalTime workEnd = wh.getEndTime();

        LocalDateTime dayStart = LocalDateTime.of(date, LocalTime.MIN);
        LocalDateTime dayEnd = LocalDateTime.of(date, LocalTime.MAX);
        List<Appointment> existing = appointmentRepository.findByDoctorAndStatusAndStartDateTimeBetween(
                doctor, Appointment.AppointmentStatus.SCHEDULED, dayStart, dayEnd);

        List<LocalDateTime> freeSlots = new ArrayList<>();
        LocalTime current = workStart;

        while (current.plusMinutes(duration).isBefore(workEnd) || current.plusMinutes(duration).equals(workEnd)) {
            if (wh.getBreakStart() != null && wh.getBreakEnd() != null) {
                if (!current.isBefore(wh.getBreakStart()) && current.isBefore(wh.getBreakEnd())) {
                    current = wh.getBreakEnd();
                    continue;
                }
            }

            LocalDateTime slotStart = LocalDateTime.of(date, current);
            LocalDateTime slotEnd = slotStart.plusMinutes(duration);

            boolean overlap = existing.stream().anyMatch(app ->
                    slotStart.isBefore(app.getEndDateTime()) && slotEnd.isAfter(app.getStartDateTime())
            );

            if (!overlap) {
                freeSlots.add(slotStart);
            }

            current = current.plusMinutes(30);
        }

        return freeSlots;
    }

    @Transactional
    public void rescheduleAppointment(Long patientId, Long appointmentId, LocalDateTime newStart) {
        Appointment app = getAppointmentById(appointmentId);
        if (!app.getPatient().getId().equals(patientId)) throw new RuntimeException("Nije vaš termin");
        app.setStartDateTime(newStart);
        app.setEndDateTime(newStart.plusMinutes(app.getService().getDurationMinutes()));
        app.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointmentRepository.save(app);
    }

    @Transactional
    public Appointment createAppointment(Long patientId, Long doctorId, Long serviceId,
                                         LocalDateTime startDateTime, String patientNotes) {
        Patient patient = patientService.getById(patientId);
        Doctor doctor = doctorService.getById(doctorId);
        DentalService service = serviceCatalogService.getById(serviceId);

        if (doctor.getSpecialization() == null || service.getSpecialization() == null) {
            throw new RuntimeException("Doktor ili usluga nemaju definisanu specijalizaciju.");
        }
        String[] doctorSpecs = doctor.getSpecialization().split(",");
        boolean specMatch = false;
        for (String spec : doctorSpecs) {
            if (spec.trim().equalsIgnoreCase(service.getSpecialization().trim())) {
                specMatch = true;
                break;
            }
        }
        if (!specMatch) {
            throw new RuntimeException("Doktor nema odgovarajuću specijalizaciju za ovu uslugu.");
        }

        LocalDate date = startDateTime.toLocalDate();
        LocalDateTime dayStart = LocalDateTime.of(date, LocalTime.MIN);
        LocalDateTime dayEnd = LocalDateTime.of(date, LocalTime.MAX);
        boolean hasAppointment = appointmentRepository.existsByPatientAndStartDateTimeBetweenAndStatus(
                patient, dayStart, dayEnd, Appointment.AppointmentStatus.SCHEDULED);
        if (hasAppointment) {
            throw new RuntimeException("Već imate zakazan termin za ovaj dan.");
        }

        List<LocalDateTime> freeSlots = getAvailableSlots(doctorId, serviceId, date);
        if (!freeSlots.contains(startDateTime)) {
            throw new RuntimeException("Odabrani termin je zauzet ili nije dostupan.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .service(service)
                .startDateTime(startDateTime)
                .endDateTime(startDateTime.plusMinutes(service.getDurationMinutes()))
                .status(Appointment.AppointmentStatus.SCHEDULED)
                .patientNotes(patientNotes)
                .build();

        appointment = appointmentRepository.save(appointment);

        // 🔇 ISKLJUČENO – samo štampa u konzolu
        String patientMessage = "Vaš termin je zakazan i čeka potvrdu doktora.";
        System.out.println("NOTIFICATION (simulacija): " + patientMessage + " za pacijenta " + patient.getPhone());
        /*
        if (patient.getEmail() != null && !patient.getEmail().isBlank()) {
            emailService.sendSimpleMessage(patient.getEmail(), "Termin na čekanju", patientMessage);
        } else if (patient.getPhone() != null && !patient.getPhone().isBlank()) {
            smsService.sendSms(patient.getPhone(), patientMessage);
        }
        */

        return appointment;
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsForPatient(Patient patient) {
        return appointmentRepository.findByPatient(patient);
    }

    @Transactional
    public void cancelAppointmentByPatient(Long patientId, Long appointmentId) {
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
        if (!app.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Nije vaš termin");
        }
        if (app.getStatus() != Appointment.AppointmentStatus.SCHEDULED &&
                app.getStatus() != Appointment.AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Termin nije aktivan");
        }
        if (LocalDateTime.now().isAfter(app.getStartDateTime().minusHours(CANCELLATION_DEADLINE_HOURS))) {
            throw new RuntimeException("Otkazivanje nije moguće manje od " + CANCELLATION_DEADLINE_HOURS + "h pre termina.");
        }
        app.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(app);

        // 🔇 ISKLJUČENO
        System.out.println("NOTIFICATION: Pacijent otkazao termin za doktora " + app.getDoctor().getFirstName());
        /*
        Doctor doctor = app.getDoctor();
        String patientName = app.getPatient().getFirstName() + " " + app.getPatient().getLastName();
        if (doctor.getEmail() != null && !doctor.getEmail().isBlank()) {
            emailService.sendCancellationNotice(doctor.getEmail(),
                    doctor.getFirstName() + " " + doctor.getLastName(),
                    patientName,
                    app.getStartDateTime(),
                    "Pacijent otkazao");
        } else if (doctor.getPhone() != null && !doctor.getPhone().isBlank()) {
            smsService.sendSms(doctor.getPhone(),
                    "Termin za pacijenta " + patientName + " (" + app.getStartDateTime() + ") je otkazan.");
        }
        */
    }

    @Transactional
    public void cancelAppointmentByDoctor(Long doctorId, Long appointmentId, String reason) {
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
        if (!app.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Nije vaš termin");
        }
        if (app.getStatus() != Appointment.AppointmentStatus.SCHEDULED &&
                app.getStatus() != Appointment.AppointmentStatus.CONFIRMED) {
            throw new RuntimeException("Termin nije aktivan");
        }
        if (LocalDateTime.now().isAfter(app.getStartDateTime().minusHours(CANCELLATION_DEADLINE_HOURS))) {
            throw new RuntimeException("Otkazivanje nije moguće manje od " + CANCELLATION_DEADLINE_HOURS + "h pre termina.");
        }
        app.setStatus(Appointment.AppointmentStatus.CANCELLED);
        app.setCancellationReason(reason);
        appointmentRepository.save(app);

        // 🔇 ISKLJUČENO
        System.out.println("NOTIFICATION: Doktor otkazao termin pacijentu " + app.getPatient().getFirstName());
        /*
        Patient patient = app.getPatient();
        String doctorName = app.getDoctor().getFirstName() + " " + app.getDoctor().getLastName();
        if (patient.getEmail() != null && !patient.getEmail().isBlank()) {
            emailService.sendCancellationNotice(patient.getEmail(),
                    patient.getFirstName() + " " + patient.getLastName(),
                    doctorName,
                    app.getStartDateTime(),
                    reason);
        } else if (patient.getPhone() != null && !patient.getPhone().isBlank()) {
            smsService.sendSms(patient.getPhone(),
                    "Vaš termin kod dr " + doctorName + " (" + app.getStartDateTime() + ") je otkazan. Razlog: " + reason);
        }
        */
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsForDoctorOnDate(Doctor doctor, LocalDate date) {
        LocalDateTime start = LocalDateTime.of(date, LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(date, LocalTime.MAX);
        return appointmentRepository.findByDoctorAndStartDateTimeBetween(doctor, start, end);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsForDoctor(Doctor doctor) {
        return appointmentRepository.findByDoctor(doctor);
    }

    @Transactional
    public void confirmAppointmentByDoctor(Long doctorId, Long appointmentId) {
        Appointment app = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
        if (!app.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException("Nije vaš termin");
        }
        if (app.getStatus() != Appointment.AppointmentStatus.SCHEDULED) {
            throw new RuntimeException("Termin nije u statusu za potvrdu");
        }
        app.setStatus(Appointment.AppointmentStatus.CONFIRMED);
        appointmentRepository.save(app);

        // 🔇 ISKLJUČENO
        System.out.println("NOTIFICATION: Termin potvrđen za pacijenta " + app.getPatient().getFirstName());
        /*
        Patient patient = app.getPatient();
        String doctorName = app.getDoctor().getFirstName() + " " + app.getDoctor().getLastName();
        String message = "Vaš termin kod dr " + doctorName + " (" + app.getStartDateTime() + ") je potvrđen.";
        if (patient.getEmail() != null && !patient.getEmail().isBlank()) {
            emailService.sendSimpleMessage(patient.getEmail(), "Termin potvrđen", message);
        } else if (patient.getPhone() != null && !patient.getPhone().isBlank()) {
            smsService.sendSms(patient.getPhone(), message);
        }
        */
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));
    }

    @Transactional(readOnly = true)
    public List<LocalDate> getAlternativeDates(Long doctorId, Long serviceId, LocalDate fromDate, int maxDays) {
        List<LocalDate> alternatives = new ArrayList<>();
        LocalDate current = fromDate.plusDays(1);
        int checked = 0;
        while (alternatives.size() < 3 && checked < maxDays) {
            List<LocalDateTime> slots = getAvailableSlots(doctorId, serviceId, current);
            if (!slots.isEmpty()) {
                alternatives.add(current);
            }
            current = current.plusDays(1);
            checked++;
        }
        return alternatives;
    }

    @Scheduled(fixedRate = 3600000) // svakih sat vremena
    @Transactional
    public void autoCompletePastAppointments() {
        List<Appointment> past = appointmentRepository
                .findByStatusAndEndDateTimeBefore(Appointment.AppointmentStatus.SCHEDULED, LocalDateTime.now());
        past.addAll(appointmentRepository
                .findByStatusAndEndDateTimeBefore(Appointment.AppointmentStatus.CONFIRMED, LocalDateTime.now()));
        for (Appointment a : past) {
            a.setStatus(Appointment.AppointmentStatus.COMPLETED);
            appointmentRepository.save(a);
        }
    }

    @Transactional
    public Appointment createManualAppointment(Long doctorId, ManualAppointmentRequest request) {
        Doctor doctor = doctorService.getById(doctorId);
        DentalService service = serviceCatalogService.getById(request.getServiceId());

        Patient patient = patientService.findByPhone(request.getPatientPhone())
                .orElseGet(() -> {
                    Patient newPatient = Patient.builder()
                            .phone(request.getPatientPhone())
                            .firstName(request.getPatientFirstName())
                            .lastName(request.getPatientLastName())
                            .email(request.getPatientPhone() + "@temp.com")
                            .password(passwordEncoder.encode("temp123"))
                            .active(true)
                            .emailVerified(true)
                            .phoneVerified(true)
                            .deleted(false)
                            .build();
                    return patientRepository.save(newPatient);
                });

        if (doctor.getSpecialization() == null || service.getSpecialization() == null) {
            throw new RuntimeException("Doktor ili usluga nemaju definisanu specijalizaciju.");
        }
        String[] doctorSpecs = doctor.getSpecialization().split(",");
        boolean specMatch = false;
        for (String spec : doctorSpecs) {
            if (spec.trim().equalsIgnoreCase(service.getSpecialization().trim())) {
                specMatch = true;
                break;
            }
        }
        if (!specMatch) {
            throw new RuntimeException("Doktor nema odgovarajuću specijalizaciju za ovu uslugu.");
        }

        LocalDate date = request.getStartDateTime().toLocalDate();
        List<LocalDateTime> freeSlots = getAvailableSlots(doctorId, request.getServiceId(), date);
        if (!freeSlots.contains(request.getStartDateTime())) {
            throw new RuntimeException("Odabrani termin je zauzet ili nije dostupan.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .service(service)
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getStartDateTime().plusMinutes(service.getDurationMinutes()))
                .status(Appointment.AppointmentStatus.CONFIRMED)
                .patientNotes(request.getPatientNotes())
                .build();

        appointment = appointmentRepository.save(appointment);

        // 🔇 ISKLJUČENO
        String message = "Vaš termin kod dr " + doctor.getFirstName() + " " + doctor.getLastName() +
                " je zakazan za " + appointment.getStartDateTime() + ".";
        System.out.println("NOTIFICATION (manual): " + message + " za pacijenta " + patient.getPhone());
        /*
        if (patient.getEmail() != null && !patient.getEmail().isBlank()) {
            emailService.sendSimpleMessage(patient.getEmail(), "Termin zakazan", message);
        }
        smsService.sendSms(patient.getPhone(), message);
        */

        return appointment;
    }
}