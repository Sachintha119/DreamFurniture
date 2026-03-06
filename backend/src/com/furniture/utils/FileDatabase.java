package com.furniture.utils;

import java.io.*;
import java.util.*;

public class FileDatabase {
    private static final String DB_PATH = "../database/";

    static {
        File dbDir = new File(DB_PATH);
        if (!dbDir.exists()) {
            dbDir.mkdirs();
        }
    }

    // Write data to file
    public static void writeToFile(String filename, String data) {
        try {
            File file = new File(DB_PATH + filename);
            FileWriter fw = new FileWriter(file, true);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(data);
            bw.newLine();
            bw.close();
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Read all lines from file
    public static List<String> readFromFile(String filename) {
        List<String> lines = new ArrayList<>();
        try {
            File file = new File(DB_PATH + filename);
            if (!file.exists()) {
                return lines;
            }
            FileReader fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);
            String line;
            while ((line = br.readLine()) != null) {
                lines.add(line);
            }
            br.close();
            fr.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }

    // Append data to file
    public static void appendToFile(String filename, String data) {
        writeToFile(filename, data);
    }

    // Clear file
    public static void clearFile(String filename) {
        try {
            FileWriter fw = new FileWriter(DB_PATH + filename);
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Delete record from file by ID
    public static void deleteRecord(String filename, String id) {
        try {
            List<String> lines = readFromFile(filename);
            FileWriter fw = new FileWriter(DB_PATH + filename);
            BufferedWriter bw = new BufferedWriter(fw);

            for (String line : lines) {
                if (!line.startsWith(id + "|")) {
                    bw.write(line);
                    bw.newLine();
                }
            }
            bw.close();
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Update record in file
    public static void updateRecord(String filename, String id, String newData) {
        try {
            List<String> lines = readFromFile(filename);
            FileWriter fw = new FileWriter(DB_PATH + filename);
            BufferedWriter bw = new BufferedWriter(fw);

            for (String line : lines) {
                if (line.startsWith(id + "|")) {
                    bw.write(newData);
                } else {
                    bw.write(line);
                }
                bw.newLine();
            }
            bw.close();
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
