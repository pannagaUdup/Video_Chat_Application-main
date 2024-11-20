package com.build.videocall.websocket;

import org.json.JSONObject;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.build.videocall.Service.WebSocketSessionService;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

// public class VideoCallHandler extends TextWebSocketHandler {
//     private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
//     private Gson gson = new Gson();
//     @Override
//     public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//         sessions.put(session.getId(), session);
//     }
//     @Override
//     public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//         Map<String, String> msg = gson.fromJson(message.getPayload(), Map.class);
//         String type = msg.get("type");
//         String roomID = msg.get("roomID");
//         if (type.equals("call")) {
//             // Notify the recipient
//             String to = msg.get("to");
//             WebSocketSession recipientSession = sessions.get(to);
//             if (recipientSession != null) {
//                 recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
//             }
//         } else if (type.equals("join")) {
//             // Notify other users in the room
//             sessions.values().forEach(s -> {
//                 if (!s.getId().equals(session.getId())) {
//                     try {
//                         s.sendMessage(new TextMessage(gson.toJson(msg)));
//                     } catch (Exception e) {
//                         e.printStackTrace();
//                     }
//                 }
//             });
//         } else if (type.equals("offer") || type.equals("answer") || type.equals("candidate")) {
//             // Forward the message to the other user
//             sessions.values().forEach(s -> {
//                 if (!s.getId().equals(session.getId())) {
//                     try {
//                         s.sendMessage(new TextMessage(gson.toJson(msg)));
//                     } catch (Exception e) {
//                         e.printStackTrace();
//                     }
//                 }
//             });
//         }
//     }
//     @Override
//     public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//         sessions.remove(session.getId());
//     }
// }                    //OG and working

           





public class VideoCallHandler extends TextWebSocketHandler {
    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private Gson gson = new Gson();



    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId=(String)session.getAttributes().get("userId");
        sessions.put(userId, session);
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
        //  else if (type.equals("join")) {
        //     // Notify other users in the room
        //     sessions.values().forEach(s -> {
        //         if (!s.getId().equals(session.getId())) {
        //             try {
        //                 s.sendMessage(new TextMessage(gson.toJson(msg)));
        //             } catch (Exception e) {
        //                 e.printStackTrace();
        //             }
        //         }
        //     });
        // } else if (type.equals("offer") || type.equals("answer") || type.equals("candidate")) {
        //     // Forward the message to the other user
        //     msg.put("from",userId);
        //     String to = msg.get("to");
        //     WebSocketSession recipientSession = sessions.get(to);
        //     if (recipientSession != null) {
        //         recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
        //     }
        // }
        // else if (type.equals("initoffer") ) {
        //     // Forward the message to the other user
        //     msg.put("from",userId);
        //     String to = msg.get("to");
        //     WebSocketSession recipientSession = sessions.get(to);
        //     if (recipientSession != null) {
        //         recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
        //     }
        // }
    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
    }
}       


// public class VideoCallHandler extends TextWebSocketHandler {
//     private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
//     private Gson gson = new Gson();
//     private final WebSocketSessionService sessionService;


//     public VideoCallHandler(WebSocketSessionService sessionService) {
//         this.sessionService = sessionService;
//     }

//     @Override
//     public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//         String userId=(String)session.getAttributes().get("userId");
//         sessions.put(userId, session);
//         sessionService.addVideoCallSession(userId, session);
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
//             WebSocketSession recipientSession = sessionService.getVideoCallSession(to);
//             if (recipientSession != null) {
//                 recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
//             }
//             sessionService.sendToHomePage(to, new TextMessage(gson.toJson(msg)));
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
//         //  else if (type.equals("join")) {
//         //     // Notify other users in the room
//         //     sessions.values().forEach(s -> {
//         //         if (!s.getId().equals(session.getId())) {
//         //             try {
//         //                 s.sendMessage(new TextMessage(gson.toJson(msg)));
//         //             } catch (Exception e) {
//         //                 e.printStackTrace();
//         //             }
//         //         }
//         //     });
//         // } else if (type.equals("offer") || type.equals("answer") || type.equals("candidate")) {
//         //     // Forward the message to the other user
//         //     msg.put("from",userId);
//         //     String to = msg.get("to");
//         //     WebSocketSession recipientSession = sessions.get(to);
//         //     if (recipientSession != null) {
//         //         recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
//         //     }
//         // }
//         // else if (type.equals("initoffer") ) {
//         //     // Forward the message to the other user
//         //     msg.put("from",userId);
//         //     String to = msg.get("to");
//         //     WebSocketSession recipientSession = sessions.get(to);
//         //     if (recipientSession != null) {
//         //         recipientSession.sendMessage(new TextMessage(gson.toJson(msg)));
//         //     }
//         // }
//     }
//     @Override
//     public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//         sessions.remove(session.getId());
//         sessionService.removeVideoCallSession(session.getId());

//     }
// }       
