package com.furniture.models;

import java.io.Serializable;

public class Product implements Serializable {
    private int id;
    private String name;
    private String category; // table or chair
    private double price;
    private String description;
    private int stock;
    private String imageUrl;
    private long createdDate;

    // Constructor
    public Product(int id, String name, String category, double price, String description, int stock) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
        this.stock = stock;
        this.createdDate = System.currentTimeMillis();
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public long getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(long createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public String toString() {
        return id + "|" + name + "|" + category + "|" + price + "|" + description + "|" + stock + "|" + createdDate;
    }
}
