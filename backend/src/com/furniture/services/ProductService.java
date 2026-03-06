package com.furniture.services;

import com.furniture.models.Product;
import com.furniture.utils.FileDatabase;
import com.furniture.utils.MSSQLDatabase;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

public class ProductService {
    private static final String PRODUCTS_FILE = "products.txt";

    // Create/Add product
    public static boolean addProduct(Product product) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "INSERT INTO products (id, name, category, price, description, stock, image_url, created_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, product.getId());
                    stmt.setString(2, product.getName());
                    stmt.setString(3, product.getCategory());
                    stmt.setDouble(4, product.getPrice());
                    stmt.setString(5, product.getDescription());
                    stmt.setInt(6, product.getStock());
                    stmt.setString(7, product.getImageUrl());
                    stmt.setLong(8, product.getCreatedDate());
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[ProductService] MSSQL add failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.writeToFile(PRODUCTS_FILE, product.toString());
        return true;
    }

    // Read all products
    public static List<Product> getAllProducts() {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                List<Product> products = new ArrayList<>();
                String sql = "SELECT * FROM products ORDER BY id ASC";
                try (PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        products.add(mapProduct(rs));
                    }
                }
                return products;
            } catch (Exception e) {
                System.err.println("[ProductService] MSSQL getAll failed, fallback file DB: " + e.getMessage());
            }
        }

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
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "SELECT TOP 1 * FROM products WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, id);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            return mapProduct(rs);
                        }
                    }
                }
                return null;
            } catch (Exception e) {
                System.err.println("[ProductService] MSSQL getById failed, fallback file DB: " + e.getMessage());
            }
        }

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
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                List<Product> products = new ArrayList<>();
                String sql = "SELECT * FROM products WHERE LOWER(category) = LOWER(?) ORDER BY id ASC";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, category);
                    try (ResultSet rs = stmt.executeQuery()) {
                        while (rs.next()) {
                            products.add(mapProduct(rs));
                        }
                    }
                }
                return products;
            } catch (Exception e) {
                System.err.println("[ProductService] MSSQL getByCategory failed, fallback file DB: " + e.getMessage());
            }
        }

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
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "UPDATE products SET name=?, category=?, price=?, description=?, stock=?, image_url=?, created_date=? WHERE id=?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, product.getName());
                    stmt.setString(2, product.getCategory());
                    stmt.setDouble(3, product.getPrice());
                    stmt.setString(4, product.getDescription());
                    stmt.setInt(5, product.getStock());
                    stmt.setString(6, product.getImageUrl());
                    stmt.setLong(7, product.getCreatedDate());
                    stmt.setInt(8, id);
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[ProductService] MSSQL update failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.updateRecord(PRODUCTS_FILE, String.valueOf(id), product.toString());
        return true;
    }

    // Delete product
    public static boolean deleteProduct(int id) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "DELETE FROM products WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, id);
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[ProductService] MSSQL delete failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.deleteRecord(PRODUCTS_FILE, String.valueOf(id));
        return true;
    }

    private static Product mapProduct(ResultSet rs) throws Exception {
        Product product = new Product(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("category"),
                rs.getDouble("price"),
                rs.getString("description"),
                rs.getInt("stock"));
        product.setImageUrl(rs.getString("image_url"));
        product.setCreatedDate(rs.getLong("created_date"));
        return product;
    }

    // Parse product from string
    private static Product parseProduct(String line) {
        try {
            String[] parts = line.split("\\|");
            if (parts.length >= 6) {
                Product product = new Product(
                        Integer.parseInt(parts[0]),
                        parts[1],
                        parts[2],
                        Double.parseDouble(parts[3]),
                        parts[4],
                        Integer.parseInt(parts[5]));
                if (parts.length >= 7) {
                    product.setImageUrl(parts[6]);
                }
                if (parts.length >= 8) {
                    product.setCreatedDate(Long.parseLong(parts[7]));
                }
                return product;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
