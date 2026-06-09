package com.dentalclinic.controller;

import com.dentalclinic.model.Doctor;
import com.dentalclinic.model.DentalService;
import com.dentalclinic.service.DoctorService;
import com.dentalclinic.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final DoctorService doctorService;
    private final ServiceCatalogService serviceCatalogService;

    @GetMapping("/doctors")
    public List<Doctor> getDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/services")
    public List<DentalService> getServices() {
        return serviceCatalogService.getAvailableServices();
    }
}