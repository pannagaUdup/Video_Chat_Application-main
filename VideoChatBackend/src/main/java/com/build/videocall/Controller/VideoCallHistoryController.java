// package com.build.videocall.Controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.build.videocall.Model.Participant;
// import com.build.videocall.Model.User;
// import com.build.videocall.Model.VideoRoom;
// import com.build.videocall.Service.ParticipantService;

// import jakarta.servlet.http.HttpSession;

// import org.springframework.web.bind.annotation.CrossOrigin;
// import java.util.*;
// import java.util.stream.Collectors;

// @RestController
// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // Enable CORS for the React app
// public class VideoCallHistoryController {

//     @Autowired
//     private ParticipantService participantService;

//     @GetMapping("/video-call-history")
//     public String getVideoHistory() {
//         return "redirect:http://localhost:3000/video-call-history"; 
//     }

//     // API to fetch video call sessions for the logged-in user
//     @GetMapping("/user-sessions")
//     public ResponseEntity<?> getUserVideoSessions(HttpSession session) {
//         User user = (User) session.getAttribute("user");

//         // Handle case where user is not logged in
//         if (user == null) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
//         }

//         // Fetch all participants where the userId matches the logged-in user
//         List<Participant> userParticipants = participantService.getParticipantsByUser(user);

//         List<Map<String, Object>> response = new ArrayList<>();

//         // Iterate over all the user's participations
//         for (Participant participant : userParticipants) {
//             VideoRoom videoRoom = participant.getVideoRoom();

//             // Prepare video session data
//             Map<String, Object> videoRoomData = new HashMap<>();
//             videoRoomData.put("videoId", videoRoom.getVideoId());
//             videoRoomData.put("roomCode", videoRoom.getRoomCode());
//             videoRoomData.put("startTime", videoRoom.getStartTime());
//             videoRoomData.put("endTime", videoRoom.getEndTime());

//             // Fetch participants in the same video room
//             List<Participant> participants = participantService.getParticipantsByRoom(videoRoom);
//             List<Map<String, Object>> participantDetails = participants.stream().map(p -> {
//                 Map<String, Object> participantData = new HashMap<>();
//                 participantData.put("userId", p.getUser().getUsername());
//                 participantData.put("startTime", p.getStartTime());
//                 participantData.put("endTime", p.getEndTime());
//                 participantData.put("isInitiator", p.isInitiatorFlag());
//                 return participantData;
//             }).collect(Collectors.toList());

//             // Add participants to the video room data
//             videoRoomData.put("participants", participantDetails);
//             response.add(videoRoomData);
//         }

//         // Return the response as JSON
//         return ResponseEntity.ok(response);
//     }
// }
