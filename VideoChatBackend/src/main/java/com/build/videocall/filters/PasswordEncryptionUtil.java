package com.build.videocall.filters;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class PasswordEncryptionUtil {

    public static String encryptPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            
            return Base64.getEncoder().encodeToString(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error occurred while encrypting password", e);
        }
    }

    public static boolean matchPassword(String enteredPassword, String storedPasswordHash) {
        String encryptedPassword = encryptPassword(enteredPassword);
        return encryptedPassword.equals(storedPasswordHash);
    }
}
