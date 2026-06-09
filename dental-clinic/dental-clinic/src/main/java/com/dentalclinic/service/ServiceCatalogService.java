package com.dentalclinic.service;

import com.dentalclinic.model.DentalService;
import com.dentalclinic.repository.DentalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCatalogService {

    private final DentalServiceRepository serviceRepository;

    public List<DentalService> getAvailableServices() {
        return serviceRepository.findByActiveTrueAndDeletedFalse();
    }

    public DentalService getById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usluga nije pronađena"));
    }
}