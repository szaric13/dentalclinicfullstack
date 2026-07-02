package com.dentalclinic.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ManualAppointmentRequest {
    private Long serviceId;
    private LocalDateTime startDateTime;
    private String patientPhone;
    private String patientFirstName;
    private String patientLastName;
    private String patientNotes;
}