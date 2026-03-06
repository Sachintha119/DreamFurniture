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
        try {
            // GET /api/users - Get all users
            if (path.equals("/api/users")) {
                java.util.List<User> users = UserService.getAllUsers();
                StringBuilder json = new StringBuilder("[");

                for (int i = 0; i < users.size(); i++) {
                    User u = users.get(i);
                    json.append("{\"id\":").append(u.getId())
                            .append(",\"name\":\"").append(u.getName())
                            .append("\",\"email\":\"").append(u.getEmail())
                            .append("\",\"phone\":\"").append(u.getPhone() != null ? u.getPhone() : "")
                            .append("\",\"registeredDate\":").append(u.getRegisteredDate())
                            .append("}");
                    if (i < users.size() - 1)
                        json.append(",");
                }
                json.append("]");

                sendJSON(exchange, 200, json.toString());
            }
            // GET /api/users/{id} - Get specific user
            else if (path.contains("/api/users/") && !path.contains("/login") && !path.contains("/register")) {
                String[] pathParts = path.split("/");
                int userId = Integer.parseInt(pathParts[pathParts.length - 1]);
                User user = UserService.getUserById(userId);

                if (user != null) {
                    String json = "{\"id\":" + user.getId() + ",\"name\":\"" + user.getName() +
                            "\",\"email\":\"" + user.getEmail() + "\",\"phone\":\"" +
                            (user.getPhone() != null ? user.getPhone() : "") +
                            "\",\"registeredDate\":" + user.getRegisteredDate() + "}";
                    sendJSON(exchange, 200, json);
                } else {
                    sendError(exchange, 404, "User not found");
                }
            } else {
                sendError(exchange, 404, "Endpoint not found");
            }
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
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
