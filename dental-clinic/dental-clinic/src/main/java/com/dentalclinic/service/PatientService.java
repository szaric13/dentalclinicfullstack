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
            Patient existing = patientRepository.findByPhone(phone)
                    .orElseThrow(() -> new RuntimeException("Nalog postoji ali nije pronađen."));
            if (!existing.getPhoneVerified()) {
                throw new RuntimeException("Nalog postoji ali nije verifikovan. Zatražite novi kod.");
            } else {
                throw new RuntimeException("Broj telefona već postoji. Prijavite se.");
            }
        }

        if (email != null && !email.isBlank() && patientRepository.existsByEmail(email)) {
            throw new RuntimeException("Email već postoji.");
        }

        String phoneCode = String.format("%06d", new Random().nextInt(999999));

        Patient patient = Patient.builder()
                .phone(phone)
                .password(passwordEncoder.encode(rawPassword))
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .dateOfBirth(dateOfBirth)
                .notes(notes)
                .active(false)
                .deleted(false)
                .emailVerified(true)   // ✅ automatically verified, we don't use email verification
                .phoneVerified(false)
                .verificationToken(null) // not used
                .phoneVerificationCode(phoneCode)
                .phoneVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10))
                .build();

        patient = patientRepository.save(patient);

        // Print code to logs (since no real SMS yet)
        System.out.println("===== VERIFICATION CODE =====");
        System.out.println("Phone: " + phone + "  Code: " + phoneCode);
        System.out.println("=============================");

        return patient;
    }

    @Transactional
    public boolean verifyPhone(String phone, String code) {
        Optional<Patient> optPatient = patientRepository.findByPhone(phone);
        if (optPatient.isEmpty()) return false;
        Patient patient = optPatient.get();
        if (patient.getPhoneVerificationCode() != null &&
                patient.getPhoneVerificationCode().equals(code) &&
                patient.getPhoneVerificationCodeExpiry().isAfter(LocalDateTime.now())) {
            patient.setPhoneVerified(true);
            patient.setPhoneVerificationCode(null);
            patient.setPhoneVerificationCodeExpiry(null);
            patient.setActive(true);
            patientRepository.save(patient);
            return true;
        }
        return false;
    }

    @Transactional
    public void resendPhoneVerificationCode(String phone) {
        Patient patient = patientRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim brojem ne postoji."));
        if (patient.getPhoneVerified()) {
            throw new RuntimeException("Telefon je već verifikovan.");
        }
        String newCode = String.format("%06d", new Random().nextInt(999999));
        patient.setPhoneVerificationCode(newCode);
        patient.setPhoneVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
        patientRepository.save(patient);
        System.out.println("New phone code for " + phone + ": " + newCode);
    }

    public Patient findByEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim email‑om ne postoji."));
    }

    public Patient updatePatient(Patient patient) {
        return patientRepository.save(patient);
    }
}