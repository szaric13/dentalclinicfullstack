package com.dentalclinic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RescheduleRequest {
    @NotNull(message = "Novi datum i vreme su obavezni")
    private LocalDateTime newStartDateTime;
}