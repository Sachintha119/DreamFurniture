package com.furniture.controllers;

import com.furniture.services.UserService;
import com.furniture.models.User;
import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.InputStream;

public class UserController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        addCORSHeaders(exchange);

        if (method.equals("POST")) {
            if (path.contains("/login")) {
                handleLogin(exchange);
            } else if (path.contains("/register")) {
                handleRegister(exchange);
            } else {
                sendError(exchange, 404, "Endpoint not found");
            }
        } else if (method.equals("GET")) {
            handleGetUser(exchange, path);
        } else if (method.equals("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
        } else {
            sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        try {
            InputStream is = exchange.getRequestBody();
            byte[] bytes = new byte[is.available()];
            is.read(bytes);
            String body = new String(bytes);

            // Parse JSON - simple parsing
            String email = extractValue(body, "email");
            String password = extractValue(body, "password");

            User user = UserService.loginUser(email, password);

            if (user != null) {
                sendJSON(exchange, 200, "{\"message\":\"Login successful\",\"user\":{\"id\":" + user.getId() +
                        ",\"name\":\"" + user.getName() + "\",\"email\":\"" + user.getEmail() + "\"}}");
            } else {
                sendError(exchange, 401, "Invalid credentials");
            }
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        try {
            InputStream is = exchange.getRequestBody();
            byte[] bytes = new byte[is.available()];
            is.read(bytes);
            String body = new String(bytes);

            // Parse JSON
            String name = extractValue(body, "name");
            String email = extractValue(body, "email");
            String password = extractValue(body, "password");

            User newUser = new User((int) (System.currentTimeMillis() % 100000), name, email, password);
            boolean success = UserService.registerUser(newUser);

            if (success) {
                sendJSON(exchange, 201, "{\"message\":\"Registration successful\",\"userId\":" + newUser.getId() + "}");
            } else {
                sendError(exchange, 409, "Email already registered");
            }
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
    }

    private void handleGetUser(HttpExchange exchange, String path) throws IOException {
        sendError(exchange, 200, "User endpoint");
    }

    private String extractValue(String json, String key) {
        int start = json.indexOf("\"" + key + "\":\"");
        if (start == -1)
            return "";
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
