package com.furniture.controllers;

import com.furniture.services.ProductService;
import com.furniture.models.Product;
import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
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
        try {
            String body = readRequestBody(exchange);

            int id = (int) (System.currentTimeMillis() % 1000000);
            String name = extractValue(body, "name");
            String category = extractValue(body, "category");
            double price = parseDouble(extractValue(body, "price"));
            String description = extractValue(body, "description");
            int stock = (int) parseDouble(extractValue(body, "stock"));
            String image = extractValue(body, "image");

            Product product = new Product(id, name, category, price, description, stock);
            product.setImageUrl(image);

            boolean success = ProductService.addProduct(product);
            if (success) {
                sendJSON(exchange, 201, "{\"message\":\"Product created successfully\",\"id\":" + id + "}");
            } else {
                sendError(exchange, 500, "Failed to create product");
            }
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
    }

    private void handlePutRequest(HttpExchange exchange, String path) throws IOException {
        try {
            if (!path.matches("/api/products/\\d+")) {
                sendError(exchange, 404, "Endpoint not found");
                return;
            }

            int id = Integer.parseInt(path.replaceAll("/api/products/", ""));
            Product existing = ProductService.getProductById(id);

            if (existing == null) {
                sendError(exchange, 404, "Product not found");
                return;
            }

            String body = readRequestBody(exchange);

            String name = extractValue(body, "name");
            String category = extractValue(body, "category");
            String priceStr = extractValue(body, "price");
            String description = extractValue(body, "description");
            String stockStr = extractValue(body, "stock");
            String image = extractValue(body, "image");

            Product updated = new Product(
                    id,
                    name.isEmpty() ? existing.getName() : name,
                    category.isEmpty() ? existing.getCategory() : category,
                    priceStr.isEmpty() ? existing.getPrice() : parseDouble(priceStr),
                    description.isEmpty() ? existing.getDescription() : description,
                    stockStr.isEmpty() ? existing.getStock() : (int) parseDouble(stockStr));

            updated.setImageUrl(image.isEmpty() ? existing.getImageUrl() : image);
            updated.setCreatedDate(existing.getCreatedDate());

            boolean success = ProductService.updateProduct(id, updated);
            if (success) {
                sendJSON(exchange, 200, "{\"message\":\"Product updated successfully\"}");
            } else {
                sendError(exchange, 500, "Failed to update product");
            }
        } catch (Exception e) {
            sendError(exchange, 400, "Invalid request");
        }
    }

    private void handleDeleteRequest(HttpExchange exchange, String path) throws IOException {
        if (!path.matches("/api/products/\\d+")) {
            sendError(exchange, 404, "Endpoint not found");
            return;
        }

        int id = Integer.parseInt(path.replaceAll("/api/products/", ""));
        boolean success = ProductService.deleteProduct(id);

        if (success) {
            sendJSON(exchange, 200, "{\"message\":\"Product deleted successfully\"}");
        } else {
            sendError(exchange, 500, "Failed to delete product");
        }
    }

    private String productToJSON(Product product) {
        return "{" +
                "\"id\":" + product.getId() + "," +
                "\"name\":\"" + escapeJson(product.getName()) + "\"," +
                "\"category\":\"" + escapeJson(product.getCategory()) + "\"," +
                "\"price\":" + product.getPrice() + "," +
                "\"description\":\"" + escapeJson(product.getDescription()) + "\"," +
                "\"stock\":" + product.getStock() + "," +
                "\"image\":\"" + escapeJson(product.getImageUrl() != null ? product.getImageUrl() : "") + "\"" +
                "}";
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int nRead;
        while ((nRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return new String(buffer.toByteArray());
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

    private double parseDouble(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0;
        }
        return Double.parseDouble(value.trim());
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
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
