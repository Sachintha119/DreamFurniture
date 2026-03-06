package com.furniture.utils;

import java.sql.*;

public class MSSQLDatabase {

    private static final String DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_PORT = "1433";
    private static final String DEFAULT_USER = "sa";
    private static final String DEFAULT_PASSWORD = "";

    private static boolean enabled = Boolean
            .parseBoolean(System.getenv("MSSQL_ENABLED") != null ? System.getenv("MSSQL_ENABLED") : "false");

    static {
        if (enabled) {
            try {
                Class.forName(DRIVER);
                System.out.println("[MSSQL] Driver loaded successfully");
            } catch (ClassNotFoundException e) {
                System.err.println("[MSSQL] Driver not found: " + e.getMessage());
                System.err.println("[MSSQL] Download: https://github.com/microsoft/mssql-jdbc");
                System.err.println("[MSSQL] Falling back to file database");
                enabled = false;
            }
        }
    }

    public static boolean isEnabled() {
        return enabled;
    }

    public static Connection getConnection() throws SQLException {
        String host = System.getenv("MSSQL_HOST") != null ? System.getenv("MSSQL_HOST") : DEFAULT_HOST;
        String port = System.getenv("MSSQL_PORT") != null ? System.getenv("MSSQL_PORT") : DEFAULT_PORT;
        String database = System.getenv("MSSQL_DATABASE") != null ? System.getenv("MSSQL_DATABASE") : "dream_furniture";
        String user = System.getenv("MSSQL_USER") != null ? System.getenv("MSSQL_USER") : DEFAULT_USER;
        String password = System.getenv("MSSQL_PASSWORD") != null ? System.getenv("MSSQL_PASSWORD") : DEFAULT_PASSWORD;
        String useWindowsAuth = System.getenv("MSSQL_WINDOWS_AUTH") != null ? System.getenv("MSSQL_WINDOWS_AUTH")
                : "false";

        String url;
        if ("true".equalsIgnoreCase(useWindowsAuth)) {
            // Windows Authentication (no user/password needed)
            url = "jdbc:sqlserver://" + host + ":" + port + ";databaseName=" + database + ";integratedSecurity=true";
            return DriverManager.getConnection(url);
        } else {
            // SQL Server Authentication
            url = "jdbc:sqlserver://" + host + ":" + port + ";databaseName=" + database;
            return DriverManager.getConnection(url, user, password);
        }
    }

    public static void initializeSchemaIfNeeded() {
        if (!isEnabled())
            return;

        try (Connection conn = getConnection()) {
            // Check if tables exist
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet tables = meta.getTables(null, null, "users", new String[] { "TABLE" });

            if (tables.next()) {
                System.out.println("[MSSQL] Schema already initialized");
                return;
            }

            try (Statement stmt = conn.createStatement()) {
                // Create users table
                stmt.execute(
                        "CREATE TABLE users (" +
                                "  id INT PRIMARY KEY," +
                                "  name VARCHAR(255) NOT NULL," +
                                "  email VARCHAR(255) NOT NULL UNIQUE," +
                                "  password VARCHAR(255) NOT NULL," +
                                "  phone VARCHAR(50)," +
                                "  address TEXT," +
                                "  registered_date BIGINT NOT NULL" +
                                ")");

                // Create products table
                stmt.execute(
                        "CREATE TABLE products (" +
                                "  id INT PRIMARY KEY," +
                                "  name VARCHAR(255) NOT NULL," +
                                "  category VARCHAR(100) NOT NULL," +
                                "  price FLOAT NOT NULL," +
                                "  description TEXT," +
                                "  stock INT NOT NULL," +
                                "  image_url TEXT," +
                                "  created_date BIGINT NOT NULL" +
                                ")");

                // Create orders table
                stmt.execute(
                        "CREATE TABLE orders (" +
                                "  order_id VARCHAR(64) PRIMARY KEY," +
                                "  customer_name VARCHAR(255) NOT NULL," +
                                "  email VARCHAR(255) NOT NULL," +
                                "  phone VARCHAR(50)," +
                                "  address TEXT," +
                                "  city VARCHAR(255)," +
                                "  zipcode VARCHAR(30)," +
                                "  total FLOAT NOT NULL," +
                                "  status VARCHAR(50) NOT NULL," +
                                "  order_date BIGINT NOT NULL" +
                                ")");

                System.out.println("[MSSQL] Schema initialized successfully");
            }
        } catch (SQLException e) {
            System.err.println("[MSSQL] Schema initialization failed: " + e.getMessage());
        }
    }
}
