package com.dentalclinic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String doctorName;
    private String serviceName;
    private LocalDateTime start;
    private LocalDateTime end;
    private String status;
    private Long doctorId;
    private Long serviceId;
}