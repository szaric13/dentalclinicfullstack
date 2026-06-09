package com.dentalclinic.repository;

import com.dentalclinic.model.DentalService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DentalServiceRepository extends JpaRepository<DentalService, Long> {
    List<DentalService> findByActiveTrueAndDeletedFalse();
}