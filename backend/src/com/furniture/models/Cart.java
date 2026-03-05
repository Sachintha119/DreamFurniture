package com.furniture.models;

public class Cart {
    private String cartId;
    private String userId;
    private String[] items; // Array of product IDs
    private int[] quantities;
    private double totalPrice;
    private long createdDate;

    public Cart(String cartId, String userId) {
        this.cartId = cartId;
        this.userId = userId;
        this.items = new String[10]; // Initial capacity
        this.quantities = new int[10];
        this.totalPrice = 0;
        this.createdDate = System.currentTimeMillis();
    }

    // Getters and Setters
    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String[] getItems() {
        return items;
    }

    public void setItems(String[] items) {
        this.items = items;
    }

    public int[] getQuantities() {
        return quantities;
    }

    public void setQuantities(int[] quantities) {
        this.quantities = quantities;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public long getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(long createdDate) {
        this.createdDate = createdDate;
    }
}
