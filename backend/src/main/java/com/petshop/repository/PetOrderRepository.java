package com.petshop.repository;

import com.petshop.model.PetOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetOrderRepository extends JpaRepository<PetOrder, Long> {}
