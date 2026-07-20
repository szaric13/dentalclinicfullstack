package com.dentalclinic.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token, String firstName) {
        String baseUrl = "https://dentalclinicfullstack.up.railway.app";
        String verificationUrl = baseUrl + "/verify-email?token=" + token;
        String subject = "Verifikujte vaš email - Dr Zarić Ordinacija";
        String body = "Poštovani " + firstName + ",\n\n"
                + "Hvala što ste se registrovali na Dr Zarić Ordinacija.\n"
                + "Kliknite na sledeći link da verifikujete vaš email:\n"
                + verificationUrl + "\n\n"
                + "Ako niste vi zahtevali registraciju, ignorišite ovaj email.\n\n"
                + "Srdačan pozdrav,\n"
                + "Dr Zarić Ordinacija tim";

        sendSimpleMessage(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        sendSimpleMessage(to, "Reset lozinke - Dr Zarić Ordinacija",
                "Kliknite na link da resetujete lozinku: " + resetLink);
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendAppointmentConfirmation(String to, String patientName,
                                            String doctorName, String dateTime) {
        String body = "Poštovani " + patientName + ",\n\n"
                + "Vaš termin kod dr " + doctorName + " je zakazan.\n"
                + "Datum i vreme: " + dateTime + "\n\n"
                + "Hvala na poverenju!";
        sendSimpleMessage(to, "Termin potvrđen", body);
    }

    // ✅ ADD THIS METHOD
    public void sendCancellationNotice(String toEmail, String recipientName,
                                       String doctorName, LocalDateTime dateTime,
                                       String reason) {
        String body = "Poštovani " + recipientName + ",\n\n"
                + "Vaš termin kod dr " + doctorName + " (" + dateTime + ") je otkazan.\n"
                + "Razlog: " + (reason != null ? reason : "nije naveden") + "\n\n"
                + "Za više informacija, kontaktirajte ordinaciju.";
        sendSimpleMessage(toEmail, "Termin otkazan", body);
    }
}