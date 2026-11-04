package com.petshop.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Column(nullable = false, length = 60)
    private String species;

    @Column(length = 100)
    private String breed;

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean available = true;

    public Pet() {}

    public Pet(String name, String species, String breed, BigDecimal price,
               String imageUrl, String description, boolean available) {
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.available = available;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSpecies() { return species; }
    public String getBreed() { return breed; }
    public BigDecimal getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public String getDescription() { return description; }
    public boolean isAvailable() { return available; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSpecies(String species) { this.species = species; }
    public void setBreed(String breed) { this.breed = breed; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setDescription(String description) { this.description = description; }
    public void setAvailable(boolean available) { this.available = available; }
}
