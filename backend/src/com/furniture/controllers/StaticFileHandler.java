package com.furniture.controllers;

import com.sun.net.httpserver.*;
import java.io.*;
import java.nio.file.*;

public class StaticFileHandler implements HttpHandler {
    private static String FRONTEND_PATH;

    static {
        // Get the base path dynamically
        String basePath = System.getProperty("user.dir");
        if (basePath.endsWith("backend")) {
            FRONTEND_PATH = basePath.substring(0, basePath.length() - 7) + "frontend";
        } else {
            FRONTEND_PATH = basePath + File.separator + "frontend";
        }
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Add CORS headers
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

        String path = exchange.getRequestURI().getPath();

        // Skip API calls
        if (path.startsWith("/api/")) {
            return;
        }

        // Default to index.html for root
        if (path.equals("/") || path.isEmpty()) {
            path = "/index.html";
        }

        try {
            String filePath = FRONTEND_PATH + path.replace("/", File.separator);
            File file = new File(filePath).getCanonicalFile();
            File frontendDir = new File(FRONTEND_PATH).getCanonicalFile();

            // Security check - prevent directory traversal
            if (!file.toPath().normalize().startsWith(frontendDir.toPath().normalize())) {
                sendError1(exchange, 403, "Forbidden");
                return;
            }

            // If directory, try index.html
            if (file.isDirectory()) {
                file = new File(file, "index.html");
            }

            if (file.exists() && file.isFile()) {
                byte[] data = Files.readAllBytes(file.toPath());
                String contentType = getContentType(file.getName());
                exchange.getResponseHeaders().add("Content-Type", contentType);
                exchange.sendResponseHeaders(200, data.length);
                exchange.getResponseBody().write(data);
            } else {
                sendError1(exchange, 404, "File not found: " + path);
            }
        } catch (Exception e) {
            sendError1(exchange, 500, "Server error: " + e.getMessage());
        }

        exchange.close();
    }

    private String getContentType(String filename) {
        if (filename.endsWith(".html"))
            return "text/html; charset=UTF-8";
        if (filename.endsWith(".css"))
            return "text/css";
        if (filename.endsWith(".js"))
            return "application/javascript";
        if (filename.endsWith(".json"))
            return "application/json";
        if (filename.endsWith(".png"))
            return "image/png";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg"))
            return "image/jpeg";
        if (filename.endsWith(".gif"))
            return "image/gif";
        if (filename.endsWith(".svg"))
            return "image/svg+xml";
        return "application/octet-stream";
    }

    private void sendError1(HttpExchange exchange, int code, String message) throws IOException {
        String response = message;
        exchange.sendResponseHeaders(code, response.length());
        exchange.getResponseBody().write(response.getBytes());
    }
}
