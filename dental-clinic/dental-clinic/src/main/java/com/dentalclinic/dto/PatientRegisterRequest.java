package com.dentalclinic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRegisterRequest {

    @NotBlank(message = "Broj telefona je obavezan")
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Broj telefona nije validan")
    private String phone;

    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati bar 6 karaktera")
    private String password;

    @NotBlank(message = "Ime je obavezno")
    private String firstName;

    @NotBlank(message = "Prezime je obavezno")
    private String lastName;

    @NotBlank @Email
    private String email;   // opciono

    private LocalDate dateOfBirth;
    private String notes;
}