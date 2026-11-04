package com.petshop.controller;

import com.petshop.model.Pet;
import com.petshop.service.PetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetService service;

    public PetController(PetService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pet> findAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Pet findById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pet create(@Valid @RequestBody Pet pet) { return service.create(pet); }

    @PutMapping("/{id}")
    public Pet update(@PathVariable Long id, @Valid @RequestBody Pet pet) {
        return service.update(id, pet);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
