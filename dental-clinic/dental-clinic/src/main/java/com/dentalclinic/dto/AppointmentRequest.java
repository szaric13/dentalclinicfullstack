package com.dentalclinic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull private Long doctorId;
    @NotNull private Long serviceId;
    @NotNull private LocalDateTime startDateTime;
    private String patientNotes;
}