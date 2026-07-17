package com.dentalclinic.repository;

import com.dentalclinic.model.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NurseRepository extends JpaRepository<Nurse, Long> {
    List<Nurse> findByDeletedFalseAndActiveTrue();
}