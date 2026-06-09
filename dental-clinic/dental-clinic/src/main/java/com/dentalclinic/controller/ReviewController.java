package com.dentalclinic.controller;

import com.dentalclinic.model.DoctorReview;
import com.dentalclinic.service.DoctorReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final DoctorReviewService reviewService;

    @PostMapping("/doctors/{doctorId}")
    public ResponseEntity<DoctorReview> addReview(@PathVariable Long doctorId,
                                                  @RequestBody Map<String, Object> body) {
        Long patientId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long appointmentId = Long.valueOf(body.get("appointmentId").toString());
        int rating = (int) body.get("rating");
        String comment = (String) body.getOrDefault("comment", "");

        DoctorReview review = reviewService.addReview(patientId, doctorId, appointmentId, rating, comment);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<List<DoctorReview>> getReviews(@PathVariable Long doctorId) {
        return ResponseEntity.ok(reviewService.getReviewsForDoctor(doctorId));
    }

    @GetMapping("/doctors/{doctorId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long doctorId) {
        return ResponseEntity.ok(reviewService.getAverageRatingForDoctor(doctorId));
    }
}