package com.dentalclinic.controller;

import com.dentalclinic.dto.*;
import com.dentalclinic.model.Doctor;
import com.dentalclinic.model.PasswordResetToken;
import com.dentalclinic.model.Patient;
import com.dentalclinic.model.RefreshToken;
import com.dentalclinic.security.JwtUtil;
import com.dentalclinic.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PatientService patientService;
    private final DoctorService doctorService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final SmsService smsService;

    @PostMapping("/patient/register")
    public ResponseEntity<String> registerPatient(@Valid @RequestBody PatientRegisterRequest request) {
        try {
            patientService.registerPatient(
                    request.getPhone(),
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getEmail(),
                    request.getDateOfBirth(),
                    request.getNotes()
            );
            return ResponseEntity.ok("Registracija uspešna. Proverite SMS za verifikacioni kod.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/patient/verify")
    public ResponseEntity<String> verifyPatientPhone(@Valid @RequestBody PatientVerifyRequest request) {
        boolean verified = patientService.verifyPhone(request.getPhone(), request.getCode());
        if (verified) {
            return ResponseEntity.ok("Telefon uspešno verifikovan. Možete se prijaviti.");
        } else {
            return ResponseEntity.badRequest().body("Neispravan kod ili je istekao.");
        }
    }

    @PostMapping("/patient/login")
    public ResponseEntity<Map<String, String>> loginPatient(@Valid @RequestBody PatientLoginRequest request) {
        try {
            Patient patient = patientService.findByPhone(request.getPhone())
                    .orElseThrow(() -> new RuntimeException("Pogrešan telefon ili lozinka"));

            if (!passwordEncoder.matches(request.getPassword(), patient.getPassword())) {
                throw new RuntimeException("Pogrešan telefon ili lozinka");
            }

            if (!patient.getActive() || !patient.getVerified()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nalog nije aktivan ili nije verifikovan"));
            }

            String accessToken = jwtUtil.generateAccessToken(patient.getId(), "PATIENT", patient.getPhone());
            RefreshToken refreshToken = refreshTokenService.createPatientRefreshToken(patient);
            String refreshTokenStr = refreshToken.getToken();

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshTokenStr);
            return ResponseEntity.ok(tokens);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/patient/refresh")
    public ResponseEntity<?> refreshPatientToken(@RequestBody Map<String, String> body) {
        try {
            String refreshTokenStr = body.get("refreshToken");
            if (refreshTokenStr == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nedostaje refreshToken"));
            }

            RefreshToken rt = refreshTokenService.findByToken(refreshTokenStr)
                    .orElseThrow(() -> new RuntimeException("Neispravan refresh token"));

            if (!refreshTokenService.isValid(rt)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Refresh token je istekao ili opozvan"));
            }

            Patient patient = rt.getPatient();
            if (patient == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token nije za pacijenta"));
            }

            refreshTokenService.revokeToken(rt);

            String newAccessToken = jwtUtil.generateAccessToken(patient.getId(), "PATIENT", patient.getPhone());
            RefreshToken newRefreshToken = refreshTokenService.createPatientRefreshToken(patient);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRefreshToken.getToken());
            return ResponseEntity.ok(tokens);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<Map<String, String>> loginDoctor(@Valid @RequestBody DoctorLoginRequest request) {
        try {
            Doctor doctor = doctorService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Pogrešan email ili lozinka"));

            if (!passwordEncoder.matches(request.getPassword(), doctor.getPassword())) {
                throw new RuntimeException("Pogrešan email ili lozinka");
            }

            if (!doctor.getActive() || doctor.getDeleted()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nalog nije aktivan"));
            }

            String accessToken = jwtUtil.generateAccessToken(doctor.getId(), "DOCTOR", doctor.getEmail());
            RefreshToken refreshToken = refreshTokenService.createDoctorRefreshToken(doctor);
            String refreshTokenStr = refreshToken.getToken();

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshTokenStr);
            return ResponseEntity.ok(tokens);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/doctor/refresh")
    public ResponseEntity<Map<String, String>> refreshDoctorToken(@RequestBody Map<String, String> body) {
        String refreshTokenStr = body.get("refreshToken");
        if (refreshTokenStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nedostaje refreshToken"));
        }

        RefreshToken rt = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Neispravan refresh token"));

        if (!refreshTokenService.isValid(rt)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token je istekao ili opozvan"));
        }

        Doctor doctor = rt.getDoctor();
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token nije za doktora"));
        }

        refreshTokenService.revokeToken(rt);

        String newAccessToken = jwtUtil.generateAccessToken(doctor.getId(), "DOCTOR", doctor.getEmail());
        RefreshToken newRefreshToken = refreshTokenService.createDoctorRefreshToken(doctor);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", newRefreshToken.getToken());
        return ResponseEntity.ok(tokens);
    }
    @PostMapping("/patient/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("Broj telefona je obavezan.");
        }
        try {
            patientService.resendVerificationCode(phone);
            return ResponseEntity.ok("Novi verifikacioni kod je poslat.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/patient/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email je obavezan.");
        }
        Patient patient = patientService.findByEmail(email);  // koristimo servis, a ne repozitorijum
        PasswordResetToken token = passwordResetTokenService.createToken(patient);
        String resetLink = "http://localhost:3000/reset-password?token=" + token.getToken();
        emailService.sendPasswordResetEmail(email, resetLink);
        return ResponseEntity.ok("Link za reset lozinke je poslat na email.");
    }


    @PostMapping("/patient/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String tokenStr = body.get("token");
        String newPassword = body.get("newPassword");
        if (tokenStr == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Token i nova lozinka su obavezni.");
        }
        PasswordResetToken token = passwordResetTokenService.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Neispravan token."));
        if (!passwordResetTokenService.isValid(token)) {
            return ResponseEntity.badRequest().body("Token je istekao ili iskorišćen.");
        }
        Patient patient = token.getPatient();
        patient.setPassword(passwordEncoder.encode(newPassword));
        patientService.updatePatient(patient);   // <-- ISPRAVLJENO (više ne koristimo patientRepository)
        passwordResetTokenService.useToken(token);
        return ResponseEntity.ok("Lozinka uspešno resetovana.");
    }
    @PostMapping("/patient/forgot-password-phone")
    public ResponseEntity<String> forgotPasswordByPhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        Patient patient = patientService.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim brojem ne postoji."));
        String code = String.format("%06d", new Random().nextInt(999999));
        patient.setVerificationCode(code);
        patient.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
        patientService.updatePatient(patient);
        smsService.sendSms(phone, "Vaš kod za reset lozinke: " + code);
        return ResponseEntity.ok("Kod za reset lozinke poslat na telefon.");
    }

    @PostMapping("/patient/reset-password-phone")
    public ResponseEntity<String> resetPasswordByPhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code");
        String newPassword = body.get("newPassword");
        Patient patient = patientService.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Nalog ne postoji."));
        if (!patient.getVerificationCode().equals(code) ||
                patient.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Neispravan kod ili je istekao.");
        }
        patient.setPassword(passwordEncoder.encode(newPassword));
        patient.setVerificationCode(null);
        patient.setVerificationCodeExpiry(null);
        patientService.updatePatient(patient);
        return ResponseEntity.ok("Lozinka uspešno resetovana.");
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body) {
        String refreshTokenStr = body.get("refreshToken");
        if (refreshTokenStr == null || refreshTokenStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nedostaje refreshToken"));
        }
        boolean revoked = refreshTokenService.revokeTokenByValue(refreshTokenStr);
        if (!revoked) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token nije pronađen ili je već opozvan."));
        }
        return ResponseEntity.ok("Odjavljeni ste.");
    }
}