package com.build.videocall.Listener;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import com.build.videocall.Model.User;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener {
    private static Set<User> activeUsers = ConcurrentHashMap.newKeySet();

    @Override
    public void sessionCreated(HttpSessionEvent event) {
        // This method is called when a session is created (logged in)
        // User user = (User) event.getSession().getAttribute("user");
        // if (user != null) {
        //     activeUsers.add(user);
        // }
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        // This method is called when a session is destroyed (logged out or expired)
        // User user = (User) event.getSession().getAttribute("user");
        // if (user != null) {
        //     activeUsers.remove(user);
        // }
    }
    public static Set<User> getActiveUsers() {
        return activeUsers;
    }
}