package com.dentalclinic.controller;

import com.dentalclinic.dto.AppointmentResponse;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Doctor;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    @GetMapping("/profile")
    public ResponseEntity<Doctor> getProfile() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Doctor doctor = doctorService.getById(userId);
        doctor.setPassword(null);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments() {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Doctor doctor = doctorService.getById(userId);
        List<Appointment> apps = appointmentService.getAppointmentsForDoctor(doctor);
        List<AppointmentResponse> responses = apps.stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getPatient().getFirstName() + " " + a.getPatient().getLastName(),   // pacijentovo ime ide u doctorName (zbunjujuće, ali tako smo odabrali)
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
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String reason = body.getOrDefault("reason", "");
            appointmentService.cancelAppointmentByDoctor(userId, id, reason);
            return ResponseEntity.ok("Termin otkazan");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @PutMapping("/appointments/{id}/confirm")
    public ResponseEntity<String> confirmAppointment(@PathVariable Long id) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            appointmentService.confirmAppointmentByDoctor(userId, id);
            return ResponseEntity.ok("Termin potvrđen");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}