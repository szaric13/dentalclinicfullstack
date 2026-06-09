package com.dentalclinic.controller;

import com.dentalclinic.dto.AppointmentResponse;
import com.dentalclinic.dto.RescheduleRequest;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Patient;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @GetMapping("/profile")
    public ResponseEntity<Patient> getProfile() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Patient patient = patientService.getById(userId);
        patient.setPassword(null);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Patient patient = patientService.getById(userId);
        List<Appointment> apps = appointmentService.getAppointmentsForPatient(patient);
        List<AppointmentResponse> responses = apps.stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName(),
                        a.getService().getName(),
                        a.getStartDateTime(),
                        a.getEndDateTime(),
                        a.getStatus().name(),
                        a.getDoctor().getId()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            appointmentService.cancelAppointmentByPatient(userId, id);
            return ResponseEntity.ok("Termin otkazan");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long id, @RequestBody RescheduleRequest request) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        appointmentService.rescheduleAppointment(userId, id, request.getNewStartDateTime());
        return ResponseEntity.ok("Termin pomeren. Doktor mora ponovo da potvrdi.");
    }
}