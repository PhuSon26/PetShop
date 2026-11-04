package com.petshop.service;

import com.petshop.dto.CreateOrderRequest;
import com.petshop.model.Pet;
import com.petshop.model.PetOrder;
import com.petshop.repository.PetOrderRepository;
import com.petshop.repository.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    private final PetOrderRepository orderRepository;
    private final PetRepository petRepository;

    public OrderService(PetOrderRepository orderRepository, PetRepository petRepository) {
        this.orderRepository = orderRepository;
        this.petRepository = petRepository;
    }

    public List<PetOrder> findAll() {
        return orderRepository.findAll();
    }

    public PetOrder create(CreateOrderRequest request) {
        Pet pet = petRepository.findById(request.petId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));
        if (!pet.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pet is not available");
        }
        BigDecimal total = pet.getPrice().multiply(BigDecimal.valueOf(request.quantity()));
        return orderRepository.save(new PetOrder(request.customerName(), pet, request.quantity(), total));
    }
}
