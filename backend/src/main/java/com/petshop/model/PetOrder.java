package com.petshop.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pet_orders")
public class PetOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String customerName;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected PetOrder() {}

    public PetOrder(String customerName, Pet pet, Integer quantity, BigDecimal totalPrice) {
        this.customerName = customerName;
        this.pet = pet;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public Pet getPet() { return pet; }
    public Integer getQuantity() { return quantity; }
    public BigDecimal getTotalPrice() { return totalPrice; }
    public Instant getCreatedAt() { return createdAt; }
}
