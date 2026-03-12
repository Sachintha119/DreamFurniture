package com.furniture.services;

import com.furniture.models.Order;
import com.furniture.utils.FileDatabase;
import com.furniture.utils.MSSQLDatabase;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

public class OrderService {
    private static final String ORDERS_FILE = "orders.txt";

    // Create order
    public static boolean createOrder(Order order) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "INSERT INTO orders (order_id, customer_name, email, phone, address, city, zipcode, total, status, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, order.getOrderId());
                    stmt.setString(2, order.getCustomerName());
                    stmt.setString(3, order.getEmail());
                    stmt.setString(4, order.getPhone());
                    stmt.setString(5, order.getAddress());
                    stmt.setString(6, order.getCity());
                    stmt.setString(7, order.getZipCode());
                    stmt.setDouble(8, order.getTotal());
                    stmt.setString(9, order.getStatus());
                    stmt.setLong(10, order.getOrderDate());
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL create failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.writeToFile(ORDERS_FILE, order.toString());
        return true;
    }

    // Get all orders
    public static List<Order> getAllOrders() {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                List<Order> orders = new ArrayList<>();
                String sql = "SELECT * FROM orders ORDER BY order_date DESC";
                try (PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        orders.add(mapOrder(rs));
                    }
                }
                return orders;
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL getAll failed, fallback file DB: " + e.getMessage());
            }
        }

        List<Order> orders = new ArrayList<>();
        List<String> lines = FileDatabase.readFromFile(ORDERS_FILE);

        for (String line : lines) {
            if (line.trim().isEmpty())
                continue;
            Order order = parseOrder(line);
            if (order != null) {
                orders.add(order);
            }
        }
        return orders;
    }

    // Get order by ID
    public static Order getOrderById(String orderId) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "SELECT TOP 1 * FROM orders WHERE order_id = ?";

                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, orderId);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            return mapOrder(rs);
                        }
                    }
                }
                return null;
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL getById failed, fallback file DB: " + e.getMessage());
            }
        }

        List<Order> orders = getAllOrders();
        for (Order order : orders) {
            if (order.getOrderId().equals(orderId)) {
                return order;
            }
        }
        return null;
    }

    // Get orders by customer email
    public static List<Order> getOrdersByCustomer(String email) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                List<Order> orders = new ArrayList<>();
                String sql = "SELECT * FROM orders WHERE email = ? ORDER BY order_date DESC";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, email);
                    try (ResultSet rs = stmt.executeQuery()) {
                        while (rs.next()) {
                            orders.add(mapOrder(rs));
                        }
                    }
                }
                return orders;
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL getByCustomer failed, fallback file DB: " + e.getMessage());
            }
        }

        List<Order> customerOrders = new ArrayList<>();
        List<Order> allOrders = getAllOrders();

        for (Order order : allOrders) {
            if (order.getEmail().equalsIgnoreCase(email)) {
                customerOrders.add(order);
            }
        }
        return customerOrders;
    }

    // Update order status
    public static boolean updateOrderStatus(String orderId, String newStatus) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, newStatus);
                    stmt.setString(2, orderId);
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL updateStatus failed, fallback file DB: " + e.getMessage());
            }
        }

        List<Order> orders = getAllOrders();
        for (Order order : orders) {
            if (order.getOrderId().equals(orderId)) {
                order.setStatus(newStatus);
                FileDatabase.updateRecord(ORDERS_FILE, orderId, order.toString());
                return true;
            }
        }
        return false;
    }

    // Cancel order
    public static boolean cancelOrder(String orderId) {
        return updateOrderStatus(orderId, "cancelled");
    }

    // Get orders by status
    public static List<Order> getOrdersByStatus(String status) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                List<Order> orders = new ArrayList<>();
                String sql = "SELECT * FROM orders WHERE status = ? ORDER BY order_date DESC";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, status);
                    try (ResultSet rs = stmt.executeQuery()) {
                        while (rs.next()) {
                            orders.add(mapOrder(rs));
                        }
                    }
                }
                return orders;
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL getByStatus failed, fallback file DB: " + e.getMessage());
            }
        }

        List<Order> statusOrders = new ArrayList<>();
        List<Order> allOrders = getAllOrders();

        for (Order order : allOrders) {
            if (order.getStatus().equalsIgnoreCase(status)) {
                statusOrders.add(order);
            }
        }
        return statusOrders;
    }

    // Delete order
    public static boolean deleteOrder(String orderId) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "DELETE FROM orders WHERE order_id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, orderId);
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[OrderService] MSSQL delete failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.deleteRecord(ORDERS_FILE, orderId);
        return true;
    }

    // Delete all orders for a user email
    public static int deleteOrdersByCustomerEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return 0;
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "DELETE FROM orders WHERE LOWER(email) = LOWER(?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, normalizedEmail);
                    return stmt.executeUpdate();
                }
            } catch (Exception e) {
                System.err.println(
                        "[OrderService] MSSQL deleteByCustomerEmail failed, fallback file DB: " + e.getMessage());
            }
        }

        int deletedCount = 0;
        List<String> lines = FileDatabase.readFromFile(ORDERS_FILE);
        FileDatabase.clearFile(ORDERS_FILE);

        for (String line : lines) {
            if (line == null || line.trim().isEmpty()) {
                continue;
            }

            Order order = parseOrder(line);
            if (order != null && order.getEmail() != null
                    && order.getEmail().trim().equalsIgnoreCase(normalizedEmail)) {
                deletedCount++;
            } else {
                FileDatabase.writeToFile(ORDERS_FILE, line);
            }
        }

        return deletedCount;
    }

    private static Order mapOrder(ResultSet rs) throws Exception {
        Order order = new Order(rs.getString("order_id"), rs.getString("customer_name"), rs.getString("email"));
        order.setPhone(rs.getString("phone"));
        order.setAddress(rs.getString("address"));
        order.setCity(rs.getString("city"));
        order.setZipCode(rs.getString("zipcode"));
        order.setTotal(rs.getDouble("total"));
        order.setStatus(rs.getString("status"));
        order.setOrderDate(rs.getLong("order_date"));
        return order;
    }

    // Parse order from string
    private static Order parseOrder(String line) {
        try {
            String[] parts = line.split("\\|");
            if (parts.length >= 10) {
                Order order = new Order(parts[0], parts[1], parts[2]);
                order.setPhone(parts[3]);
                order.setAddress(parts[4]);
                order.setCity(parts[5]);
                order.setZipCode(parts[6]);
                order.setTotal(Double.parseDouble(parts[7]));
                order.setStatus(parts[8]);
                order.setOrderDate(Long.parseLong(parts[9]));
                return order;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
