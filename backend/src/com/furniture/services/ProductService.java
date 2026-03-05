package com.furniture.services;

import com.furniture.models.Product;
import com.furniture.utils.FileDatabase;
import java.util.*;

public class ProductService {
    private static final String PRODUCTS_FILE = "products.txt";

    // Create/Add product
    public static boolean addProduct(Product product) {
        FileDatabase.writeToFile(PRODUCTS_FILE, product.toString());
        return true;
    }

    // Read all products
    public static List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        List<String> lines = FileDatabase.readFromFile(PRODUCTS_FILE);

        for (String line : lines) {
            if (line.trim().isEmpty())
                continue;
            Product product = parseProduct(line);
            if (product != null) {
                products.add(product);
            }
        }
        return products;
    }

    // Read product by ID
    public static Product getProductById(int id) {
        List<Product> products = getAllProducts();
        for (Product product : products) {
            if (product.getId() == id) {
                return product;
            }
        }
        return null;
    }

    // Get products by category
    public static List<Product> getProductsByCategory(String category) {
        List<Product> products = new ArrayList<>();
        List<Product> allProducts = getAllProducts();

        for (Product product : allProducts) {
            if (product.getCategory().equalsIgnoreCase(category)) {
                products.add(product);
            }
        }
        return products;
    }

    // Update product
    public static boolean updateProduct(int id, Product product) {
        FileDatabase.updateRecord(PRODUCTS_FILE, String.valueOf(id), product.toString());
        return true;
    }

    // Delete product
    public static boolean deleteProduct(int id) {
        FileDatabase.deleteRecord(PRODUCTS_FILE, String.valueOf(id));
        return true;
    }

    // Parse product from string
    private static Product parseProduct(String line) {
        try {
            String[] parts = line.split("\\|");
            if (parts.length >= 7) {
                Product product = new Product(
                        Integer.parseInt(parts[0]),
                        parts[1],
                        parts[2],
                        Double.parseDouble(parts[3]),
                        parts[4],
                        Integer.parseInt(parts[5]));
                product.setCreatedDate(Long.parseLong(parts[6]));
                return product;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
