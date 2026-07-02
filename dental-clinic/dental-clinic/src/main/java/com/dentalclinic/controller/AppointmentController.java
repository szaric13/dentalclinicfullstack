package com.dentalclinic.controller;

import com.dentalclinic.dto.AppointmentRequest;
import com.dentalclinic.dto.AppointmentResponse;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalDateTime>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalDateTime> slots = appointmentService.getAvailableSlots(doctorId, serviceId, date);
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@Valid @RequestBody AppointmentRequest request) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Appointment app = appointmentService.createAppointment(
                    userId,
                    request.getDoctorId(),
                    request.getServiceId(),
                    request.getStartDateTime(),
                    request.getPatientNotes()
            );
            AppointmentResponse resp = new AppointmentResponse(
                    app.getId(),
                    app.getDoctor().getFirstName() + " " + app.getDoctor().getLastName(),
                    app.getService().getName(),
                    app.getStartDateTime(),
                    app.getEndDateTime(),
                    app.getStatus().name(),
                    app.getDoctor().getId(),
                    app.getService().getId()
            );
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/alternative-dates")
    public ResponseEntity<List<LocalDate>> getAlternativeDates(
            @RequestParam Long doctorId,
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate) {
        return ResponseEntity.ok(appointmentService.getAlternativeDates(doctorId, serviceId, fromDate, 14));
    }
}