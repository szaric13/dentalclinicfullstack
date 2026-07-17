package com.dentalclinic.service;

import com.dentalclinic.model.Nurse;
import com.dentalclinic.repository.NurseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NurseService {

    private final NurseRepository nurseRepository;

    public List<Nurse> getAllActiveNurses() {
        return nurseRepository.findByDeletedFalseAndActiveTrue();
    }

    public Nurse getById(Long id) {
        return nurseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sestra nije pronađena"));
    }

    public Nurse save(Nurse nurse) {
        return nurseRepository.save(nurse);
    }

    public void softDelete(Long id) {
        Nurse nurse = getById(id);
        nurse.setDeleted(true);
        nurse.setActive(false);
        nurseRepository.save(nurse);
    }


}