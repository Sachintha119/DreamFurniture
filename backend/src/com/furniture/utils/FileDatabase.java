package com.furniture.utils;

import java.io.*;
import java.util.*;

public class FileDatabase {
    private static final File DB_DIR = resolveDatabaseDirectory();

    static {
        if (!DB_DIR.exists()) {
            DB_DIR.mkdirs();
        }
    }

    private static File resolveDatabaseDirectory() {
        List<File> candidates = new ArrayList<>();

        try {
            File codeSource = new File(FileDatabase.class.getProtectionDomain().getCodeSource().getLocation().toURI());
            File classpathRoot = codeSource.isFile() ? codeSource.getParentFile() : codeSource;
            if (classpathRoot != null) {
                File projectRoot = classpathRoot.getParentFile();
                if (projectRoot != null) {
                    candidates.add(new File(projectRoot, "database"));
                }
                candidates.add(new File(classpathRoot, "database"));
            }
        } catch (Exception ignored) {
        }

        File workingDirectory = new File(System.getProperty("user.dir"));
        candidates.add(new File(workingDirectory, "database"));

        File parentDirectory = workingDirectory.getParentFile();
        if (parentDirectory != null) {
            candidates.add(new File(parentDirectory, "database"));
        }

        for (File candidate : candidates) {
            if (candidate.exists()) {
                return candidate;
            }
        }

        return candidates.isEmpty() ? new File("database") : candidates.get(0);
    }

    private static File getFile(String filename) {
        return new File(DB_DIR, filename);
    }

    // Write data to file
    public static void writeToFile(String filename, String data) {
        try {
            File file = getFile(filename);
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
            File file = getFile(filename);
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
            FileWriter fw = new FileWriter(getFile(filename));
            fw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Delete record from file by ID
    public static void deleteRecord(String filename, String id) {
        try {
            List<String> lines = readFromFile(filename);
            FileWriter fw = new FileWriter(getFile(filename));
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
            FileWriter fw = new FileWriter(getFile(filename));
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
