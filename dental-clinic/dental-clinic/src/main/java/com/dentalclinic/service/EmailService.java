package com.dentalclinic.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    public void sendAppointmentConfirmation(String toEmail, String patientName,
                                            String doctorName, String dateTime) {
        System.out.println("============================================");
        System.out.println("EMAIL (simulacija)");
        System.out.println("To: " + toEmail);
        System.out.println("Poštovani " + patientName + ",");
        System.out.println("Vaš termin kod dr " + doctorName + " je zakazan.");
        System.out.println("Datum i vreme: " + dateTime);
        System.out.println("============================================");
    }

    public void sendCancellationNoticeToDoctor(String toEmail, String doctorName,
                                               String patientName, LocalDateTime dateTime,
                                               String reason) {
        System.out.println("===== EMAIL (simulacija) =====");
        System.out.println("To: " + toEmail);
        System.out.println("Poštovani dr " + doctorName + ",");
        System.out.println("Termin za pacijenta " + patientName + " (" + dateTime + ") je otkazan.");
        System.out.println("Razlog: " + (reason != null ? reason : "nije naveden"));
        System.out.println("==============================");
    }
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        System.out.println("===== EMAIL (simulacija) =====");
        System.out.println("To: " + toEmail);
        System.out.println("Kliknite na link za reset lozinke: " + resetLink);
        System.out.println("==============================");
    }
    public void sendSimpleMessage(String to, String subject, String text) {
        System.out.println("===== EMAIL =====");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println(text);
        System.out.println("=================");
    }

}