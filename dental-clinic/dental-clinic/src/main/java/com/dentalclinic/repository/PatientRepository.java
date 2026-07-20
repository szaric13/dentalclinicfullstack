package com.dentalclinic.repository;

import com.dentalclinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPhone(String phone);
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByVerificationToken(String token);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}