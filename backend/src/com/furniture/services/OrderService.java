package com.furniture.services;

import com.furniture.models.Order;
import com.furniture.models.OrderItem;
import com.furniture.utils.FileDatabase;
import java.util.*;

public class OrderService {
    private static final String ORDERS_FILE = "orders.txt";

    // Create order
    public static boolean createOrder(Order order) {
        FileDatabase.writeToFile(ORDERS_FILE, order.toString());
        return true;
    }

    // Get all orders
    public static List<Order> getAllOrders() {
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
        FileDatabase.deleteRecord(ORDERS_FILE, orderId);
        return true;
    }

    // Parse order from string
    private static Order parseOrder(String line) {
        try {
            String[] parts = line.split("\\|");
            if (parts.length >= 9) {
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
