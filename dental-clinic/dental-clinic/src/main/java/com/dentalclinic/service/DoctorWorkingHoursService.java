package com.dentalclinic.service;

import com.dentalclinic.dto.DoctorWorkingHoursRequest;
import com.dentalclinic.model.DoctorWorkingHours;
import com.dentalclinic.repository.DoctorWorkingHoursRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorWorkingHoursService {

    private final DoctorWorkingHoursRepository workingHoursRepository;
    private final DoctorService doctorService;

    @Transactional
    public void saveOrUpdate(DoctorWorkingHoursRequest request) {
        DoctorWorkingHours wh = workingHoursRepository
                .findByDoctorIdAndDayOfWeek(request.getDoctorId(), request.getDayOfWeek())
                .orElseGet(() -> DoctorWorkingHours.builder()
                        .doctor(doctorService.getById(request.getDoctorId()))
                        .dayOfWeek(request.getDayOfWeek())
                        .build());
        wh.setStartTime(request.getStartTime());
        wh.setEndTime(request.getEndTime());
        wh.setBreakStart(request.getBreakStart());
        wh.setBreakEnd(request.getBreakEnd());
        workingHoursRepository.save(wh);
    }

    public Optional<DoctorWorkingHours> getWorkingHoursForDay(Long doctorId, DayOfWeek dayOfWeek) {
        return workingHoursRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek.getValue());
    }
}