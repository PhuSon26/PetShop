package com.petshop.controller;

import com.petshop.dto.CreateOrderRequest;
import com.petshop.model.PetOrder;
import com.petshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<PetOrder> findAll() { return service.findAll(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PetOrder create(@Valid @RequestBody CreateOrderRequest request) {
        return service.create(request);
    }
}
