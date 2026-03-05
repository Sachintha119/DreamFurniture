package com.furniture.controllers;

import com.furniture.services.ProductService;
import com.furniture.models.Product;
import com.sun.net.httpserver.*;
import java.io.IOException;
import java.util.List;

public class ProductController implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // Add CORS headers
        addCORSHeaders(exchange);

        if (method.equals("GET")) {
            handleGetRequest(exchange, path);
        } else if (method.equals("POST")) {
            handlePostRequest(exchange);
        } else if (method.equals("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
        } else {
            sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handleGetRequest(HttpExchange exchange, String path) throws IOException {
        if (path.matches("/api/products/\\d+")) {
            // Get product by ID
            int id = Integer.parseInt(path.replaceAll("/api/products/", ""));
            Product product = ProductService.getProductById(id);

            if (product != null) {
                sendJSON(exchange, 200, productToJSON(product));
            } else {
                sendError(exchange, 404, "Product not found");
            }
        } else {
            // Get all products
            List<Product> products = ProductService.getAllProducts();
            String json = "[";
            for (int i = 0; i < products.size(); i++) {
                json += productToJSON(products.get(i));
                if (i < products.size() - 1)
                    json += ",";
            }
            json += "]";
            sendJSON(exchange, 200, json);
        }
    }

    private void handlePostRequest(HttpExchange exchange) throws IOException {
        // Add new product (admin only)
        sendJSON(exchange, 201, "{\"message\":\"Product created successfully\"}");
    }

    private String productToJSON(Product product) {
        return "{" +
                "\"id\":" + product.getId() + "," +
                "\"name\":\"" + product.getName() + "\"," +
                "\"category\":\"" + product.getCategory() + "\"," +
                "\"price\":" + product.getPrice() + "," +
                "\"description\":\"" + product.getDescription() + "\"," +
                "\"stock\":" + product.getStock() +
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
