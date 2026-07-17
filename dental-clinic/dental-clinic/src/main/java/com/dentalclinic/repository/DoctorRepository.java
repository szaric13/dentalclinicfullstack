package com.dentalclinic.repository;

import com.dentalclinic.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);

    // ✅ NOVO: vraća samo doktore koji nisu obrisani i koji su aktivni
    List<Doctor> findByDeletedFalseAndActiveTrue();
}