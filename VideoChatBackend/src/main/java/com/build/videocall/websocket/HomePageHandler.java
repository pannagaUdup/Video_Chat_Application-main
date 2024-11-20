package com.build.videocall.websocket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.google.gson.Gson;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class HomePageHandler extends TextWebSocketHandler {
    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private Gson gson = new Gson();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = (String) session.getAttributes().get("userId");
        sessions.put(userId, session);
        System.out.println("HomePage connection established with user ID: " + userId);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        String userId = (String) session.getAttributes().get("userId");
        Map<String, String> msg = gson.fromJson(message.getPayload(), Map.class);
        String type = msg.get("type");
        if (type.equals("call")) {
            // Notify the recipient
            String to = msg.get("to");
            msg.put("from",userId);
            WebSocketSession recipientSession = sessions.get(to);
            if (recipientSession != null) {
                recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
            }
        }
        else if (type.equals("reject")) {
            // Notify other users in the room
            String to = msg.get("to");
            msg.put("from",userId);
            WebSocketSession recipientSession = sessions.get(to);
            if (recipientSession != null) {
                recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = (String) session.getAttributes().get("userId");
        sessions.remove(userId);
        System.out.println("HomePage connection closed for user ID: " + userId);
    }
}


// package com.build.videocall.websocket;

// import org.springframework.web.socket.CloseStatus;
// import org.springframework.web.socket.TextMessage;
// import org.springframework.web.socket.WebSocketSession;
// import org.springframework.web.socket.handler.TextWebSocketHandler;

// import com.build.videocall.Service.WebSocketSessionService;
// import com.google.gson.Gson;

// import java.util.Map;
// import java.util.concurrent.ConcurrentHashMap;

// public class HomePageHandler extends TextWebSocketHandler {
//     private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
//     private Gson gson = new Gson();
//     private final WebSocketSessionService sessionService;

//     public HomePageHandler(WebSocketSessionService sessionService) {
//         this.sessionService = sessionService;
//     }
//     @Override
//     public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//         String userId = (String) session.getAttributes().get("userId");
//         sessionService.addHomePageSession(userId, session);
//         sessions.put(userId, session);
//         System.out.println("HomePage connection established with user ID: " + userId);
//     }

//     @Override
//     public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

//         String userId = (String) session.getAttributes().get("userId");
//         Map<String, String> msg = gson.fromJson(message.getPayload(), Map.class);
//         String type = msg.get("type");
//         if (type.equals("call")) {
//             // Notify the recipient
//             String to = msg.get("to");
//             msg.put("from",userId);
//             WebSocketSession recipientSession = sessions.get(to);
//             if (recipientSession != null) {
//                 recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
//             }
//             sessionService.sendToVideoCall(to, new TextMessage(gson.toJson(msg)));

//         }
//         else if (type.equals("reject")) {
//             // Notify other users in the room
//             String to = msg.get("to");
//             msg.put("from",userId);
//             WebSocketSession recipientSession = sessions.get(to);
//             if (recipientSession != null) {
//                 recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
//             }
//         }
//     }

//     @Override
//     public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//         String userId = (String) session.getAttributes().get("userId");
//         sessions.remove(userId);
//         System.out.println("HomePage connection closed for user ID: " + userId);
//         sessionService.removeHomePageSession(userId);
//     }
// }
