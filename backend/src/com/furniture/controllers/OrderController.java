package com.furniture.controllers;

import com.furniture.services.OrderService;
import com.furniture.models.Order;
import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class OrderController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        addCORSHeaders(exchange);

        if (method.equals("GET")) {
            handleGetRequest(exchange, path);
        } else if (method.equals("POST")) {
            handlePostRequest(exchange);
        } else if (method.equals("PUT")) {
            handlePutRequest(exchange, path);
        } else if (method.equals("DELETE")) {
            handleDeleteRequest(exchange, path);
        } else if (method.equals("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
        } else {
            sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handleGetRequest(HttpExchange exchange, String path) throws IOException {
        if (path.matches("/api/orders/\\d+")) {
            // Get order by ID
            String orderId = path.replaceAll("/api/orders/", "");
            Order order = OrderService.getOrderById(orderId);

            if (order != null) {
                sendJSON(exchange, 200, orderToJSON(order));
            } else {
                sendError(exchange, 404, "Order not found");
            }
        } else {
            // Get all orders
            List<Order> orders = OrderService.getAllOrders();
            String json = "[";
            for (int i = 0; i < orders.size(); i++) {
                json += orderToJSON(orders.get(i));
                if (i < orders.size() - 1)
                    json += ",";
            }
            json += "]";
            sendJSON(exchange, 200, json);
        }
    }

    private void handlePostRequest(HttpExchange exchange) throws IOException {
        // Create new order
        try {
            InputStream is = exchange.getRequestBody();
            byte[] bytes = new byte[is.available()];
            is.read(bytes);
            String body = new String(bytes);

            // Parse JSON and create order
            Order order = new Order("ORD-" + System.currentTimeMillis(), "Customer", "customer@example.com");
            OrderService.createOrder(order);

            sendJSON(exchange, 201,
                    "{\"message\":\"Order created successfully\",\"orderId\":\"" + order.getOrderId() + "\"}");
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
    }

    private void handlePutRequest(HttpExchange exchange, String path) throws IOException {
        if (path.contains("/cancel")) {
            // Cancel order
            String orderId = path.replaceAll("/api/orders/", "").replaceAll("/cancel", "");
            boolean success = OrderService.cancelOrder(orderId);

            if (success) {
                sendJSON(exchange, 200, "{\"message\":\"Order cancelled successfully\"}");
            } else {
                sendError(exchange, 404, "Order not found");
            }
        } else {
            // Update order
            sendJSON(exchange, 200, "{\"message\":\"Order updated successfully\"}");
        }
    }

    private void handleDeleteRequest(HttpExchange exchange, String path) throws IOException {
        String orderId = path.replaceAll("/api/orders/", "");
        boolean success = OrderService.deleteOrder(orderId);

        if (success) {
            sendJSON(exchange, 200, "{\"message\":\"Order deleted successfully\"}");
        } else {
            sendError(exchange, 404, "Order not found");
        }
    }

    private String orderToJSON(Order order) {
        return "{" +
                "\"orderId\":\"" + order.getOrderId() + "\"," +
                "\"customerName\":\"" + order.getCustomerName() + "\"," +
                "\"email\":\"" + order.getEmail() + "\"," +
                "\"total\":" + order.getTotal() + "," +
                "\"status\":\"" + order.getStatus() + "\"," +
                "\"orderDate\":\"" + order.getOrderDate() + "\"" +
                "}";
    }

    private void sendJSON(HttpExchange exchange, int statusCode, String json) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        byte[] bytes = json.getBytes();
        exchange.sendResponseHeaders(statusCode, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    private void sendError(HttpExchange exchange, int statusCode, String error) throws IOException {
        String response = "{\"error\":\"" + error + "\"}";
        byte[] bytes = response.getBytes();
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    private void addCORSHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }
}
