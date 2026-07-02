package com.dentalclinic.service;

import com.dentalclinic.dto.DoctorWorkingHoursRequest;
import com.dentalclinic.model.DoctorWorkingHours;
import com.dentalclinic.repository.DoctorWorkingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorWorkingHoursService {

    private final DoctorWorkingHoursRepository workingHoursRepository;
    private final DoctorService doctorService;

    public Optional<DoctorWorkingHours> getWorkingHoursForDay(Long doctorId, DayOfWeek dayOfWeek) {
        return workingHoursRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek.getValue());
    }
    @Transactional
    public void saveOrUpdate(DoctorWorkingHoursRequest request) {
        int day = request.getDayOfWeek();
        LocalTime start = request.getStartTime();
        LocalTime end = request.getEndTime();

        if (day < 1 || day > 6) {
            throw new RuntimeException("Radno vreme se može unositi samo za ponedeljak–subotu (1–6).");
        }

        LocalTime globalStart = LocalTime.of(8, 0);
        LocalTime globalEnd = (day == 6) ? LocalTime.of(12, 0) : LocalTime.of(19, 0);

        if (start != null && start.isBefore(globalStart)) {
            throw new RuntimeException("Početak radnog vremena ne može biti pre 08:00.");
        }
        if (end != null && end.isAfter(globalEnd)) {
            throw new RuntimeException("Kraj radnog vremena ne može biti posle " + globalEnd + ".");
        }
        if (start != null && end != null && !start.isBefore(end)) {
            throw new RuntimeException("Vreme početka mora biti pre vremena kraja.");
        }

        DoctorWorkingHours wh = workingHoursRepository
                .findByDoctorIdAndDayOfWeek(request.getDoctorId(), day)
                .orElseGet(() -> DoctorWorkingHours.builder()
                        .doctor(doctorService.getById(request.getDoctorId()))
                        .dayOfWeek(day)
                        .build());

        wh.setStartTime(start);
        wh.setEndTime(end);
        wh.setBreakStart(request.getBreakStart());
        wh.setBreakEnd(request.getBreakEnd());
        workingHoursRepository.save(wh);
    }
}