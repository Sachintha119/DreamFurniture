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
        if (path.startsWith("/api/orders/") && !path.endsWith("/cancel")) {
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
            byte[] bytes = is.readAllBytes();
            String body = new String(bytes);

            String orderId = extractValue(body, "orderId");
            if (orderId == null || orderId.trim().isEmpty()) {
                orderId = "ORD-" + System.currentTimeMillis();
            }

            String customerName = extractValue(body, "customerName");
            if (customerName == null || customerName.trim().isEmpty()) {
                customerName = "Customer";
            }

            String email = extractValue(body, "email");
            if (email == null || email.trim().isEmpty()) {
                email = extractValue(body, "userEmail");
            }
            if (email == null || email.trim().isEmpty()) {
                email = "customer@example.com";
            }

            Order order = new Order(orderId, customerName, email);

            String phone = extractValue(body, "phone");
            String address = extractValue(body, "address");
            String city = extractValue(body, "city");
            String zipCode = extractValue(body, "zipcode");
            if (zipCode == null || zipCode.trim().isEmpty()) {
                zipCode = extractValue(body, "zipCode");
            }

            String totalStr = extractValue(body, "total");
            String status = extractValue(body, "status");
            String orderDateStr = extractValue(body, "orderDate");

            order.setPhone(phone);
            order.setAddress(address);
            order.setCity(city);
            order.setZipCode(zipCode);

            try {
                order.setTotal(
                        (totalStr == null || totalStr.trim().isEmpty()) ? 0 : Double.parseDouble(totalStr.trim()));
            } catch (Exception ignored) {
                order.setTotal(0);
            }

            order.setStatus((status == null || status.trim().isEmpty()) ? "pending" : status.trim());

            try {
                if (orderDateStr != null && !orderDateStr.trim().isEmpty()) {
                    // If numeric epoch provided, use it; otherwise keep current timestamp
                    order.setOrderDate(Long.parseLong(orderDateStr.trim()));
                }
            } catch (Exception ignored) {
                // keep default timestamp from model
            }

            boolean success = OrderService.createOrder(order);

            if (!success) {
                sendError(exchange, 500, "Failed to create order");
                return;
            }

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
            try {
                if (!path.matches("/api/orders/.+")) {
                    sendError(exchange, 404, "Endpoint not found");
                    return;
                }

                String orderId = path.replaceAll("/api/orders/", "");
                InputStream is = exchange.getRequestBody();
                byte[] bytes = is.readAllBytes();
                String body = new String(bytes);
                String status = extractValue(body, "status");

                if (status == null || status.trim().isEmpty()) {
                    sendError(exchange, 400, "Status is required");
                    return;
                }

                boolean success = OrderService.updateOrderStatus(orderId, status.trim());
                if (success) {
                    sendJSON(exchange, 200, "{\"message\":\"Order updated successfully\"}");
                } else {
                    sendError(exchange, 404, "Order not found");
                }
            } catch (Exception e) {
                sendError(exchange, 400, "Invalid request");
            }
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
                "\"phone\":\"" + (order.getPhone() != null ? order.getPhone() : "") + "\"," +
                "\"address\":\"" + (order.getAddress() != null ? order.getAddress() : "") + "\"," +
                "\"total\":" + order.getTotal() + "," +
                "\"status\":\"" + order.getStatus() + "\"," +
                "\"orderDate\":" + order.getOrderDate() + "" +
                "}";
    }

    private String extractValue(String json, String key) {
        int keyIndex = json.indexOf("\"" + key + "\"");
        if (keyIndex == -1)
            return "";

        int colonIndex = json.indexOf(":", keyIndex);
        if (colonIndex == -1)
            return "";

        int valueStart = colonIndex + 1;
        while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
            valueStart++;
        }

        if (valueStart >= json.length())
            return "";

        if (json.charAt(valueStart) == '"') {
            valueStart++;
            int valueEnd = json.indexOf('"', valueStart);
            if (valueEnd == -1)
                return "";
            return json.substring(valueStart, valueEnd);
        }

        int valueEnd = valueStart;
        while (valueEnd < json.length() && json.charAt(valueEnd) != ',' && json.charAt(valueEnd) != '}') {
            valueEnd++;
        }
        return json.substring(valueStart, valueEnd).trim();
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
