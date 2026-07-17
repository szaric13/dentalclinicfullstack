package com.dentalclinic.service;

import com.dentalclinic.model.Doctor;
import com.dentalclinic.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<Doctor> findByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    // ✅ IZMENJENO: vraća samo aktivne, neobrisane doktore
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByDeletedFalseAndActiveTrue();
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor getById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doktor nije pronađen"));
    }

    // ✅ Soft delete – označava kao obrisanog i neaktivnog
    public void softDelete(Long id) {
        Doctor doctor = getById(id);
        doctor.setDeleted(true);
        doctor.setActive(false);
        doctorRepository.save(doctor);
    }

    public void updateSpecialization(Long id, String specialization) {
        Doctor doctor = getById(id);
        doctor.setSpecialization(specialization);
        doctorRepository.save(doctor);
    }
}