package com.petshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotNull Long petId,
        @NotNull @Min(1) Integer quantity
) {}
