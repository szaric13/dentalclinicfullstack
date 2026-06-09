package com.dentalclinic.service;

import com.dentalclinic.model.Patient;
import com.dentalclinic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmsService smsService;

    public Optional<Patient> findByPhone(String phone) {
        return patientRepository.findByPhone(phone);
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pacijent nije pronađen"));
    }

    public boolean existsByPhone(String phone) {
        return patientRepository.existsByPhone(phone);
    }

    @Transactional
    public Patient registerPatient(String phone, String rawPassword, String firstName,
                                   String lastName, String email, LocalDate dateOfBirth, String notes) {
        if (existsByPhone(phone)) {
            Patient existing = patientRepository.findByPhone(phone).get();
            if (!existing.getVerified()) {
                throw new RuntimeException("Nalog postoji, ali nije verifikovan. Zatražite novi kod na /api/auth/patient/resend-verification");
            } else {
                throw new RuntimeException("Broj telefona već postoji. Prijavite se.");
            }
        }

        if (email != null && !email.isBlank() && patientRepository.existsByEmail(email)) {
            throw new RuntimeException("Email već postoji.");
        }

        Patient patient = Patient.builder()
                .phone(phone)
                .password(passwordEncoder.encode(rawPassword))
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .dateOfBirth(dateOfBirth)
                .notes(notes)
                .active(false)
                .verified(false)
                .deleted(false)
                .build();

        String code = String.format("%06d", new Random().nextInt(999999));
        patient.setVerificationCode(code);
        patient.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));

        patient = patientRepository.save(patient);
        smsService.sendSms(phone, "Vaš verifikacioni kod: " + code);

        return patient;
    }

    @Transactional
    public boolean verifyPhone(String phone, String code) {
        Optional<Patient> optPatient = patientRepository.findByPhone(phone);
        if (optPatient.isEmpty()) return false;

        Patient patient = optPatient.get();
        if (patient.getVerificationCode().equals(code) &&
                patient.getVerificationCodeExpiry().isAfter(LocalDateTime.now())) {
            patient.setVerified(true);
            patient.setActive(true);
            patient.setVerificationCode(null);
            patient.setVerificationCodeExpiry(null);
            patientRepository.save(patient);
            return true;
        }
        return false;
    }

    @Transactional
    public void resendVerificationCode(String phone) {
        Patient patient = patientRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim brojem telefona ne postoji."));

        if (patient.getVerified()) {
            throw new RuntimeException("Nalog je već verifikovan. Možete se prijaviti.");
        }

        String newCode = String.format("%06d", new Random().nextInt(999999));
        patient.setVerificationCode(newCode);
        patient.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
        patientRepository.save(patient);

        smsService.sendSms(phone, "Vaš novi verifikacioni kod: " + newCode);
    }
    public Patient findByEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim email‑om ne postoji."));
    }
    public Patient updatePatient(Patient patient) {
        return patientRepository.save(patient);
    }
}