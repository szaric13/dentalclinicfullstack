package com.dentalclinic.service;

import com.dentalclinic.model.*;
import com.dentalclinic.repository.DoctorReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorReviewService {

    private final DoctorReviewRepository reviewRepository;
    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    @Transactional
    public DoctorReview addReview(Long patientId, Long doctorId, Long appointmentId, int rating, String comment) {
        Patient patient = patientService.getById(patientId);
        Doctor doctor = doctorService.getById(doctorId);
        Appointment appointment = appointmentService.getAppointmentById(appointmentId);

        DoctorReview review = DoctorReview.builder()
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .rating(rating)
                .comment(comment)
                .build();
        return reviewRepository.save(review);
    }

    public List<DoctorReview> getReviewsForDoctor(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }

    public Double getAverageRatingForDoctor(Long doctorId) {
        return reviewRepository.averageRatingByDoctorId(doctorId);
    }
}