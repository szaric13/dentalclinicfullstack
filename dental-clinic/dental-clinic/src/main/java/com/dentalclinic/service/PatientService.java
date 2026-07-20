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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TwilioService twilioService;

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
            if (!existing.getPhoneVerified() || !existing.getEmailVerified()) {
                throw new RuntimeException("Nalog postoji ali nije verifikovan. Zatražite novi kod.");
            } else {
                throw new RuntimeException("Broj telefona već postoji. Prijavite se.");
            }
        }

        if (email != null && !email.isBlank() && patientRepository.existsByEmail(email)) {
            throw new RuntimeException("Email već postoji.");
        }

        String verificationToken = UUID.randomUUID().toString();
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
                .emailVerified(false)
                .phoneVerified(false)
                .verificationToken(verificationToken)
                .phoneVerificationCode(phoneCode)
                .phoneVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10))
                .build();

        patient = patientRepository.save(patient);

        // Send email verification
        if (email != null && !email.isBlank()) {
            emailService.sendVerificationEmail(email, verificationToken, firstName);
        }

        // Send SMS verification
        twilioService.sendSms(phone, "Vaš verifikacioni kod za Dr Zarić Ordinaciju je: " + phoneCode);

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
            // Activate only if email is also verified? We'll allow partial, but login requires both.
            if (patient.getEmailVerified()) {
                patient.setActive(true);
            }
            patientRepository.save(patient);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean verifyEmail(String token) {
        Optional<Patient> optPatient = patientRepository.findByVerificationToken(token);
        if (optPatient.isEmpty()) return false;
        Patient patient = optPatient.get();
        patient.setEmailVerified(true);
        patient.setVerificationToken(null);
        if (patient.getPhoneVerified()) {
            patient.setActive(true);
        }
        patientRepository.save(patient);
        return true;
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
        twilioService.sendSms(phone, "Vaš novi verifikacioni kod: " + newCode);
    }

    @Transactional
    public void resendEmailVerification(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim email‑om ne postoji."));
        if (patient.getEmailVerified()) {
            throw new RuntimeException("Email je već verifikovan.");
        }
        String newToken = UUID.randomUUID().toString();
        patient.setVerificationToken(newToken);
        patientRepository.save(patient);
        emailService.sendVerificationEmail(email, newToken, patient.getFirstName());
    }

    public Patient findByEmail(String email) {
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nalog sa tim email‑om ne postoji."));
    }

    public Patient updatePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public boolean existsByEmail(String email) {
        return patientRepository.existsByEmail(email);
    }
}