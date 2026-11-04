package com.petshop.config;

import com.petshop.model.Pet;
import com.petshop.repository.PetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedPets(PetRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Pet("Milo", "Cat", "British Shorthair",
                        new BigDecimal("3500000"), "", "A calm and friendly cat.", true));
                repository.save(new Pet("Buddy", "Dog", "Golden Retriever",
                        new BigDecimal("5200000"), "", "Playful family companion.", true));
                repository.save(new Pet("Kiwi", "Bird", "Budgerigar",
                        new BigDecimal("450000"), "", "A cheerful little bird.", true));
            }
        };
    }
}
