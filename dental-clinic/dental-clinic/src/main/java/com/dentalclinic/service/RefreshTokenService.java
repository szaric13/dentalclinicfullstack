package com.dentalclinic.service;

import com.dentalclinic.model.Doctor;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.RefreshToken;
import com.dentalclinic.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken createPatientRefreshToken(Patient patient) {
        RefreshToken token = RefreshToken.builder()
                .patient(patient)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(token);
    }

    public RefreshToken createDoctorRefreshToken(Doctor doctor) {
        RefreshToken token = RefreshToken.builder()
                .doctor(doctor)
                .token(UUID.randomUUID().toString())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(token);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean isValid(RefreshToken token) {
        return token != null && !token.getRevoked() && token.getExpiryDate().isAfter(LocalDateTime.now());
    }

    public void revokeToken(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }

    public boolean revokeTokenByValue(String tokenValue) {
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(tokenValue);
        if (tokenOpt.isPresent()) {
            RefreshToken token = tokenOpt.get();
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            return true;
        }
        return false;
    }
}