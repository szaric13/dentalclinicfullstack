package com.dentalclinic.repository;

import com.dentalclinic.model.Appointment;
import com.dentalclinic.model.Doctor;
import com.dentalclinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorAndStartDateTimeBetween(Doctor doctor, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByPatientAndStartDateTimeBetween(Patient patient, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByDoctorAndStatusAndStartDateTimeBetween(Doctor doctor, Appointment.AppointmentStatus status, LocalDateTime start, LocalDateTime end);
    boolean existsByPatientAndStartDateTimeBetweenAndStatus(Patient patient, LocalDateTime start, LocalDateTime end, Appointment.AppointmentStatus status);
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByStatusAndEndDateTimeBefore(Appointment.AppointmentStatus status, LocalDateTime dateTime);

}