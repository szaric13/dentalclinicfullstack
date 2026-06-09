package com.dentalclinic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatientVerifyRequest {
    @NotBlank private String phone;
    @NotBlank private String code;
}