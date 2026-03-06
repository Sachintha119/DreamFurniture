package com.furniture.services;

import com.furniture.models.User;
import com.furniture.utils.FileDatabase;
import com.furniture.utils.MSSQLDatabase;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

public class UserService {
    private static final String USERS_FILE = "users.txt";

    // Register user
    public static boolean registerUser(User user) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                if (getUserByEmail(user.getEmail()) != null) {
                    return false;
                }
                String sql = "INSERT INTO users (id, name, email, password, phone, address, registered_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, user.getId());
                    stmt.setString(2, user.getName());
                    stmt.setString(3, user.getEmail());
                    stmt.setString(4, user.getPassword());
                    stmt.setString(5, user.getPhone());
                    stmt.setString(6, user.getAddress());
                    stmt.setLong(7, user.getRegisteredDate());
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL insert failed, fallback file DB: " + e.getMessage());
            }
        }

        if (getUserByEmail(user.getEmail()) != null) {
            return false;
        }
        FileDatabase.writeToFile(USERS_FILE, user.toString());
        return true;
    }

    // Login user
    public static User loginUser(String email, String password) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "SELECT TOP 1 * FROM users WHERE email = ? AND password = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, email);
                    stmt.setString(2, password);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            return mapUser(rs);
                        }
                    }
                }
                return null;
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL login failed, fallback file DB: " + e.getMessage());
            }
        }

        User user = getUserByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // Get all users
    public static List<User> getAllUsers() {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                List<User> users = new ArrayList<>();
                String sql = "SELECT * FROM users ORDER BY registered_date DESC";
                try (PreparedStatement stmt = conn.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        users.add(mapUser(rs));
                    }
                }
                return users;
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL getAll failed, fallback file DB: " + e.getMessage());
            }
        }

        List<User> users = new ArrayList<>();
        List<String> lines = FileDatabase.readFromFile(USERS_FILE);

        for (String line : lines) {
            if (line.trim().isEmpty())
                continue;
            User user = parseUser(line);
            if (user != null) {
                users.add(user);
            }
        }
        return users;
    }

    // Get user by ID
    public static User getUserById(int id) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "SELECT TOP 1 * FROM users WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, id);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            return mapUser(rs);
                        }
                    }
                }
                return null;
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL getById failed, fallback file DB: " + e.getMessage());
            }
        }

        List<User> users = getAllUsers();
        for (User user : users) {
            if (user.getId() == id) {
                return user;
            }
        }
        return null;
    }

    // Get user by email
    public static User getUserByEmail(String email) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "SELECT TOP 1 * FROM users WHERE email = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, email);
                    try (ResultSet rs = stmt.executeQuery()) {
                        if (rs.next()) {
                            return mapUser(rs);
                        }
                    }
                }
                return null;
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL getByEmail failed, fallback file DB: " + e.getMessage());
            }
        }

        List<User> users = getAllUsers();
        for (User user : users) {
            if (user.getEmail().equalsIgnoreCase(email)) {
                return user;
            }
        }
        return null;
    }

    // Update user
    public static boolean updateUser(int id, User user) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "UPDATE users SET name=?, email=?, password=?, phone=?, address=?, registered_date=? WHERE id=?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setString(1, user.getName());
                    stmt.setString(2, user.getEmail());
                    stmt.setString(3, user.getPassword());
                    stmt.setString(4, user.getPhone());
                    stmt.setString(5, user.getAddress());
                    stmt.setLong(6, user.getRegisteredDate());
                    stmt.setInt(7, id);
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL update failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.updateRecord(USERS_FILE, String.valueOf(id), user.toString());
        return true;
    }

    // Delete user
    public static boolean deleteUser(int id) {
        if (MSSQLDatabase.isEnabled()) {
            MSSQLDatabase.initializeSchemaIfNeeded();
            try (Connection conn = MSSQLDatabase.getConnection()) {
                String sql = "DELETE FROM users WHERE id = ?";
                try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                    stmt.setInt(1, id);
                    return stmt.executeUpdate() > 0;
                }
            } catch (Exception e) {
                System.err.println("[UserService] MSSQL delete failed, fallback file DB: " + e.getMessage());
            }
        }

        FileDatabase.deleteRecord(USERS_FILE, String.valueOf(id));
        return true;
    }

    private static User mapUser(ResultSet rs) throws Exception {
        User user = new User(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("password"));
        user.setPhone(rs.getString("phone"));
        user.setAddress(rs.getString("address"));
        user.setRegisteredDate(rs.getLong("registered_date"));
        return user;
    }

    // Parse user from string
    private static User parseUser(String line) {
        try {
            String[] parts = line.split("\\|");
            if (parts.length >= 6) {
                User user = new User(
                        Integer.parseInt(parts[0]),
                        parts[1],
                        parts[2],
                        parts[3]);
                user.setPhone(parts[4]);
                user.setRegisteredDate(Long.parseLong(parts[5]));
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
