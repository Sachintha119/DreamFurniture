package com.furniture;

import com.furniture.controllers.*;
import com.sun.net.httpserver.*;
import java.io.IOException;
import java.net.InetSocketAddress;

public class FurnitureServer {
    private static final int PORT = 8080;
    private static HttpServer server;

    public static void main(String[] args) {
        try {
            // Create HTTP server
            server = HttpServer.create(new InetSocketAddress(PORT), 0);

            // Register API endpoints
            registerEndpoints();

            // Set thread pool
            server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(10));

            // Start server
            server.start();

            System.out.println("========================================");
            System.out.println("Dream Furniture Server is running!");
            System.out.println("Port: " + PORT);
            System.out.println("API Base URL: http://localhost:" + PORT + "/api");
            System.out.println("========================================");
            System.out.println("Available Endpoints:");
            System.out.println("- GET /api/products");
            System.out.println("- GET /api/products/{id}");
            System.out.println("- GET /api/orders");
            System.out.println("- POST /api/orders");
            System.out.println("- GET /api/orders/{id}");
            System.out.println("- PUT /api/orders/{id}");
            System.out.println("- PUT /api/orders/{id}/cancel");
            System.out.println("- POST /api/users/login");
            System.out.println("- POST /api/users/register");
            System.out.println("- POST /api/payment");
            System.out.println("========================================");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void registerEndpoints() {
        // Frontend static files
        server.createContext("/", new com.furniture.controllers.StaticFileHandler());

        // Products API
        server.createContext("/api/products", new ProductController());

        // Orders API
        server.createContext("/api/orders", new OrderController());

        // Users API
        server.createContext("/api/users", new UserController());

        // Payment API
        server.createContext("/api/payment", new PaymentController());

        // CORS options
        server.createContext("/options", new CORSHandler());
    }

    public static void stop() {
        server.stop(0);
    }
}
