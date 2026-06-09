package com.dentalclinic.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class DoctorWorkingHoursRequest {
    private Long doctorId;
    private int dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime breakStart;
    private LocalTime breakEnd;
}