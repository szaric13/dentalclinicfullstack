package com.dentalclinic.service;

import com.dentalclinic.model.Doctor;
import com.dentalclinic.model.PasswordResetToken;
import com.dentalclinic.model.Patient;
import com.dentalclinic.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetToken createToken(Patient patient) {
        PasswordResetToken token = PasswordResetToken.builder()
                .patient(patient)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();
        return passwordResetTokenRepository.save(token);
    }

    public PasswordResetToken createToken(Doctor doctor) {
        PasswordResetToken token = PasswordResetToken.builder()
                .doctor(doctor)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();
        return passwordResetTokenRepository.save(token);
    }

    public Optional<PasswordResetToken> findByToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    public boolean isValid(PasswordResetToken token) {
        return token != null && !token.getUsed() && token.getExpiryDate().isAfter(LocalDateTime.now());
    }

    public void useToken(PasswordResetToken token) {
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }
}