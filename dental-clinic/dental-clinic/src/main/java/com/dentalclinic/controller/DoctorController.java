package com.dentalclinic.controller;

import com.dentalclinic.dto.AppointmentResponse;
import com.dentalclinic.dto.DoctorWorkingHoursRequest;
import com.dentalclinic.dto.ManualAppointmentRequest;
import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Doctor;
import com.dentalclinic.service.AppointmentService;
import com.dentalclinic.service.DoctorService;
import com.dentalclinic.service.DoctorWorkingHoursService;
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
    private final DoctorWorkingHoursService workingHoursService;

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
                        a.getPatient().getFirstName() + " " + a.getPatient().getLastName(),
                        a.getService().getName(),
                        a.getStartDateTime(),
                        a.getEndDateTime(),
                        a.getStatus().name(),
                        a.getDoctor().getId(),
                        a.getService().getId()
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

    @PostMapping("/appointments/manual")
    public ResponseEntity<?> createManualAppointment(@RequestBody ManualAppointmentRequest request) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Appointment app = appointmentService.createManualAppointment(userId, request);
            AppointmentResponse resp = new AppointmentResponse(
                    app.getId(),
                    app.getPatient().getFirstName() + " " + app.getPatient().getLastName(),
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

    @PutMapping("/working-hours")
    public ResponseEntity<String> updateWorkingHours(@RequestBody DoctorWorkingHoursRequest request) {
        try {
            Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            request.setDoctorId(userId);
            workingHoursService.saveOrUpdate(request);
            return ResponseEntity.ok("Radno vreme ažurirano.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.softDelete(id);
            return ResponseEntity.ok("Doktor uspešno obrisan (soft delete).");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}