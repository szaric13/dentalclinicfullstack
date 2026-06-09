package com.dentalclinic.repository;

import com.dentalclinic.model.DoctorWorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorWorkingHoursRepository extends JpaRepository<DoctorWorkingHours, Long> {
    Optional<DoctorWorkingHours> findByDoctorIdAndDayOfWeek(Long doctorId, int dayOfWeek);
}