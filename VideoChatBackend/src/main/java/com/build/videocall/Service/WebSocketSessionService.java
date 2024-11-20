package com.build.videocall.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import org.springframework.stereotype.Service;

@Service
public class WebSocketSessionService {

    // Maps to store WebSocket sessions for videoCall and homePageWebSocket
    private Map<String, WebSocketSession> videoCallSessions = new ConcurrentHashMap<>();
    private Map<String, WebSocketSession> homePageSessions = new ConcurrentHashMap<>();

    public void addVideoCallSession(String userId, WebSocketSession session) {
        videoCallSessions.put(userId, session);
    }

    public void addHomePageSession(String userId, WebSocketSession session) {
        homePageSessions.put(userId, session);
    }

    public WebSocketSession getVideoCallSession(String userId) {
        return videoCallSessions.get(userId);
    }

    public WebSocketSession getHomePageSession(String userId) {
        return homePageSessions.get(userId);
    }

    public void removeVideoCallSession(String userId) {
        videoCallSessions.remove(userId);
    }

    public void removeHomePageSession(String userId) {
        homePageSessions.remove(userId);
    }

    public void sendToHomePage(String userId, TextMessage message) throws Exception {
        WebSocketSession homeSession = homePageSessions.get(userId);
        if (homeSession != null && homeSession.isOpen()) {
            homeSession.sendMessage(message);
        }
    }

    public void sendToVideoCall(String userId, TextMessage message) throws Exception {
        WebSocketSession videoSession = videoCallSessions.get(userId);
        if (videoSession != null && videoSession.isOpen()) {
            videoSession.sendMessage(message);
        }
    }
}
