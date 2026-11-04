package com.petshop.service;

import com.petshop.model.Pet;
import com.petshop.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PetService {
    private final PetRepository repository;

    public PetService(PetRepository repository) {
        this.repository = repository;
    }

    public List<Pet> findAll() {
        return repository.findAll();
    }

    public Pet findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
    }

    public Pet create(Pet pet) {
        pet.setId(null);
        return repository.save(pet);
    }

    public Pet update(Long id, Pet input) {
        Pet current = findById(id);
        current.setName(input.getName());
        current.setSpecies(input.getSpecies());
        current.setBreed(input.getBreed());
        current.setPrice(input.getPrice());
        current.setImageUrl(input.getImageUrl());
        current.setDescription(input.getDescription());
        current.setAvailable(input.isAvailable());
        return repository.save(current);
    }

    public void delete(Long id) {
        Pet pet = findById(id);
        repository.delete(pet);
    }
}
