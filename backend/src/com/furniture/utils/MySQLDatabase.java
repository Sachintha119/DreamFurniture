package com.furniture.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class MySQLDatabase {
    private static final String MYSQL_ENABLED = System.getenv().getOrDefault("MYSQL_ENABLED", "false");
    private static final String MYSQL_HOST = System.getenv().getOrDefault("MYSQL_HOST", "localhost");
    private static final String MYSQL_PORT = System.getenv().getOrDefault("MYSQL_PORT", "3306");
    private static final String MYSQL_DATABASE = System.getenv().getOrDefault("MYSQL_DATABASE", "dream_furniture");
    private static final String MYSQL_USER = System.getenv().getOrDefault("MYSQL_USER", "root");
    private static final String MYSQL_PASSWORD = System.getenv().getOrDefault("MYSQL_PASSWORD", "");

    private static final String JDBC_URL = "jdbc:mysql://" + MYSQL_HOST + ":" + MYSQL_PORT + "/" + MYSQL_DATABASE
            + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    private static boolean initialized = false;

    public static boolean isEnabled() {
        return "true".equalsIgnoreCase(MYSQL_ENABLED);
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(JDBC_URL, MYSQL_USER, MYSQL_PASSWORD);
    }

    public static synchronized void initializeSchemaIfNeeded() {
        if (!isEnabled() || initialized) {
            return;
        }

        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS users ("
                    + "id INT PRIMARY KEY,"
                    + "name VARCHAR(255) NOT NULL,"
                    + "email VARCHAR(255) NOT NULL UNIQUE,"
                    + "password VARCHAR(255) NOT NULL,"
                    + "phone VARCHAR(50),"
                    + "address TEXT,"
                    + "registered_date BIGINT NOT NULL"
                    + ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS products ("
                    + "id INT PRIMARY KEY,"
                    + "name VARCHAR(255) NOT NULL,"
                    + "category VARCHAR(100) NOT NULL,"
                    + "price DOUBLE NOT NULL,"
                    + "description TEXT,"
                    + "stock INT NOT NULL,"
                    + "image_url TEXT,"
                    + "created_date BIGINT NOT NULL"
                    + ")");

            stmt.execute("CREATE TABLE IF NOT EXISTS orders ("
                    + "order_id VARCHAR(64) PRIMARY KEY,"
                    + "customer_name VARCHAR(255) NOT NULL,"
                    + "email VARCHAR(255) NOT NULL,"
                    + "phone VARCHAR(50),"
                    + "address TEXT,"
                    + "city VARCHAR(255),"
                    + "zipcode VARCHAR(30),"
                    + "total DOUBLE NOT NULL,"
                    + "status VARCHAR(50) NOT NULL,"
                    + "order_date BIGINT NOT NULL"
                    + ")");

            initialized = true;
            System.out.println("[MySQL] Schema initialized successfully.");
        } catch (Exception e) {
            System.err
                    .println("[MySQL] Schema initialization failed. Falling back to file database. " + e.getMessage());
        }
    }
}
