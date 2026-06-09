package com.dentalclinic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PatientLoginRequest {

    @NotBlank(message = "Broj telefona je obavezan")
    private String phone;

    @NotBlank(message = "Lozinka je obavezna")
    private String password;
}