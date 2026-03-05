package com.furniture.controllers;

import com.furniture.services.PaymentService;
import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.InputStream;

public class PaymentController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();

        addCORSHeaders(exchange);

        if (method.equals("POST")) {
            handlePayment(exchange);
        } else if (method.equals("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
        } else {
            sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handlePayment(HttpExchange exchange) throws IOException {
        try {
            InputStream is = exchange.getRequestBody();
            byte[] bytes = new byte[is.available()];
            is.read(bytes);
            String body = new String(bytes);

            // Parse payment data
            String orderId = extractValue(body, "orderId");
            String cardNumber = extractValue(body, "cardNumber");
            String amount = extractValue(body, "amount");
            String paymentMethod = extractValue(body, "paymentMethod");

            // Validate card
            if (!PaymentService.validateCard(cardNumber, "", "")) {
                sendError(exchange, 400, "Invalid card details");
                return;
            }

            // Process payment
            boolean success = PaymentService.processPayment(orderId, cardNumber, Double.parseDouble(amount),
                    paymentMethod);

            if (success) {
                sendJSON(exchange, 200, "{\"message\":\"Payment processed successfully\",\"orderId\":\"" + orderId
                        + "\",\"status\":\"completed\"}");
            } else {
                sendError(exchange, 402, "Payment failed");
            }
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
    }

    private String extractValue(String json, String key) {
        int start = json.indexOf("\"" + key + "\":\"");
        if (start == -1) {
            start = json.indexOf("\"" + key + "\":");
            if (start == -1)
                return "";
            start += key.length() + 2;
            int end = json.indexOf(",", start);
            if (end == -1)
                end = json.indexOf("}", start);
            return json.substring(start, end).trim();
        }
        start += key.length() + 4;
        int end = json.indexOf("\"", start);
        return json.substring(start, end);
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
