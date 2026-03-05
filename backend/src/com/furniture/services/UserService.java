package com.furniture.services;

import com.furniture.models.User;
import com.furniture.utils.FileDatabase;
import java.util.*;

public class UserService {
    private static final String USERS_FILE = "users.txt";

    // Register user
    public static boolean registerUser(User user) {
        if (getUserByEmail(user.getEmail()) != null) {
            return false; // Email already exists
        }
        FileDatabase.writeToFile(USERS_FILE, user.toString());
        return true;
    }

    // Login user
    public static User loginUser(String email, String password) {
        User user = getUserByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // Get all users
    public static List<User> getAllUsers() {
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
        FileDatabase.updateRecord(USERS_FILE, String.valueOf(id), user.toString());
        return true;
    }

    // Delete user
    public static boolean deleteUser(int id) {
        FileDatabase.deleteRecord(USERS_FILE, String.valueOf(id));
        return true;
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
