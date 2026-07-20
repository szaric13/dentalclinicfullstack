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

    // ==================== PATIENT REGISTER ====================
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

    // ==================== PATIENT VERIFY PHONE ====================
    @PostMapping("/patient/verify-phone")
    public ResponseEntity<String> verifyPhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code");
        if (phone == null || code == null) {
            return ResponseEntity.badRequest().body("Telefon i kod su obavezni.");
        }
        boolean verified = patientService.verifyPhone(phone, code);
        if (verified) {
            return ResponseEntity.ok("Telefon uspešno verifikovan.");
        } else {
            return ResponseEntity.badRequest().body("Neispravan ili istekao kod.");
        }
    }

    // ==================== RESEND PHONE CODE ====================
    @PostMapping("/patient/resend-phone")
    public ResponseEntity<String> resendPhoneVerification(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("Broj telefona je obavezan.");
        }
        try {
            patientService.resendPhoneVerificationCode(phone);
            return ResponseEntity.ok("Novi verifikacioni kod je poslat na telefon.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== PATIENT LOGIN ====================
    @PostMapping("/patient/login")
    public ResponseEntity<Map<String, String>> loginPatient(@Valid @RequestBody PatientLoginRequest request) {
        try {
            Patient patient = patientService.findByPhone(request.getPhone())
                    .orElseThrow(() -> new RuntimeException("Pogrešan telefon ili lozinka"));

            if (!passwordEncoder.matches(request.getPassword(), patient.getPassword())) {
                throw new RuntimeException("Pogrešan telefon ili lozinka");
            }

            // ✅ Only check phone verification – email is completely ignored
            if (!patient.getPhoneVerified()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Telefon nije verifikovan."));
            }

            if (!patient.getActive()) {
                patient.setActive(true);
                patientService.updatePatient(patient);
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

    // ==================== PATIENT REFRESH ====================
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

    // ==================== DOCTOR LOGIN ====================
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

    // ==================== DOCTOR REFRESH ====================
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

    // ==================== FORGOT PASSWORD (EMAIL) ====================
    @PostMapping("/patient/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email je obavezan.");
        }
        Patient patient = patientService.findByEmail(email);
        PasswordResetToken token = passwordResetTokenService.createToken(patient);
        String resetLink = "https://dentalclinicfullstack-production.up.railway.app/reset-password?token=" + token.getToken();
        emailService.sendPasswordResetEmail(email, resetLink);
        return ResponseEntity.ok("Link za reset lozinke je poslat na email.");
    }

    // ==================== RESET PASSWORD (EMAIL TOKEN) ====================
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
        patient.setEmailVerified(true);   // optional – not used, but harmless
        patient.setActive(true);
        patientService.updatePatient(patient);
        passwordResetTokenService.useToken(token);
        return ResponseEntity.ok("Lozinka uspešno resetovana. Sada možete da se prijavite.");
    }

    // ==================== FORGOT PASSWORD (PHONE) ====================
    @PostMapping("/patient/forgot-password-phone")
    public ResponseEntity<String> forgotPasswordByPhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        try {
            Patient patient = patientService.findByPhone(phone)
                    .orElseThrow(() -> new RuntimeException("Nalog sa tim brojem ne postoji."));
            String code = String.format("%06d", new Random().nextInt(999999));
            patient.setPhoneVerificationCode(code);
            patient.setPhoneVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
            patientService.updatePatient(patient);
            smsService.sendSms(phone, "Vaš kod za reset lozinke: " + code);
            return ResponseEntity.ok("Kod za reset lozinke poslat na telefon.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }

    // ==================== RESET PASSWORD (PHONE CODE) ====================
    @PostMapping("/patient/reset-password-phone")
    public ResponseEntity<String> resetPasswordByPhone(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String code = body.get("code");
        String newPassword = body.get("newPassword");
        try {
            Patient patient = patientService.findByPhone(phone)
                    .orElseThrow(() -> new RuntimeException("Nalog ne postoji."));
            if (!patient.getPhoneVerificationCode().equals(code) ||
                    patient.getPhoneVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("Neispravan kod ili je istekao.");
            }
            patient.setPassword(passwordEncoder.encode(newPassword));
            patient.setPhoneVerificationCode(null);
            patient.setPhoneVerificationCodeExpiry(null);
            patient.setPhoneVerified(true);
            patient.setActive(true);
            patientService.updatePatient(patient);
            return ResponseEntity.ok("Lozinka uspešno resetovana. Sada možete da se prijavite.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Greška: " + e.getMessage());
        }
    }

    // ==================== LOGOUT ====================
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

    // ==================== BACKWARD COMPATIBILITY ====================
    @PostMapping("/patient/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone != null && !phone.isBlank()) {
            return resendPhoneVerification(body);
        }
        return ResponseEntity.badRequest().body("Potreban je broj telefona.");
    }
}