package com.dentalclinic;

import com.dentalclinic.model.Doctor;
import com.dentalclinic.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
@EnableScheduling
public class DentalClinicApplication {

	public static void main(String[] args) {
		SpringApplication.run(DentalClinicApplication.class, args);
	}
	@Bean
	CommandLineRunner initDoctors(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			List<Doctor> doctors = doctorRepository.findAll();
			for (Doctor doctor : doctors) {
				if (doctor.getPassword().equals("$2a$10$placeholder")) {
					doctor.setPassword(passwordEncoder.encode("doktor123"));
					doctorRepository.save(doctor);
				}
			}
		};
	}
}
