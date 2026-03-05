package com.furniture.controllers;

import com.sun.net.httpserver.*;
import java.io.IOException;

public class CORSHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if (exchange.getRequestMethod().equals("OPTIONS")) {
            exchange.sendResponseHeaders(200, -1);
        } else {
            exchange.sendResponseHeaders(404, 0);
        }
        exchange.close();
    }
}
