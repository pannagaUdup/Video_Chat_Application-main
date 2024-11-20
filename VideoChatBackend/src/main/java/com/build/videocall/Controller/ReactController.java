package com.build.videocall.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.build.videocall.Listener.SessionListener;
import com.build.videocall.Model.Participant;
import com.build.videocall.Model.User;
import com.build.videocall.Model.VideoRoom;
import com.build.videocall.Service.ParticipantService;
import com.build.videocall.Service.VideoRoomService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReactController {

    @Value("${app.reactUrl}")
    private String reactUrl;

     @Autowired
    VideoRoomService videoRoomService;

    // @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @GetMapping("/logout-react")
    public String logout(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            SessionListener.getActiveUsers().remove(user);
        }
        session.invalidate();  
        return "redirect:"+reactUrl;  
    }


     @PostMapping("/api/joinRoom")
    public ResponseEntity<?> joinRoom(@RequestBody Map<String, String> requestData) {
        String roomId = requestData.get("roomId");

        Optional<VideoRoom> videoRoom = videoRoomService.findRoomByCode(roomId);

        if (videoRoom.isPresent()) {
            // Room exists, return success
            return ResponseEntity.ok(Collections.singletonMap("roomExists", true));
        } else {
            // Room does not exist, return failure
            return ResponseEntity.ok(Collections.singletonMap("roomExists", false));
        }
    }
}
