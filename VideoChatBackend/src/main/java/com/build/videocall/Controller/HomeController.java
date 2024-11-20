package com.build.videocall.Controller;

import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.build.videocall.Dao.ParticipantDTO;
import com.build.videocall.Dao.ParticipantRepository;
import com.build.videocall.Dao.VideoRoomRepository;
import com.build.videocall.Listener.SessionListener;
import com.build.videocall.Model.Participant;
import com.build.videocall.Model.User;
import com.build.videocall.Model.VideoRoom;
import com.build.videocall.Service.ParticipantService;
import com.build.videocall.Service.RoomRequest;
import com.build.videocall.Service.UserService;
import com.build.videocall.Service.VideoRoomService;
import com.build.videocall.filters.PasswordEncryptionUtil;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@Controller 
// @CrossOrigin(origins = "http://localhost:3000")  
public class HomeController {

    @Value("${app.reactUrl}")
    private String reactUrl;

    @Autowired
    UserService userService;

    @Autowired
    ParticipantService participantService;

    @Autowired
    VideoRoomService videoRoomService;

    // @GetMapping("/")
    // public String viewHomepage() {
    //     return "index"; 
    // }
    // @GetMapping("/login")
    // public String LoginPage(){
    //     return "login";
    // }
    // @GetMapping("/register")
    // public String RegisterPage(){
    //     return "register";
    // }
    // @PostMapping("/register")
    // public String createuser(@ModelAttribute User user,HttpSession session){
    //     if(userService.checkEmail(user.getEmail())){
    //         session.setAttribute("msg", "email already exists!!");
    //         return "redirect:/signin";
    //     }
    //     else if (user.getEmail().isEmpty()||user.getFirstName().isEmpty()||user.getLastName().isEmpty()||user.getPassword().isEmpty()||user.getUsername().isEmpty()) {
    //         session.setAttribute("msg", "All fields are required.");
    //     }
    //     else{
    //         userService.createUser(user);
    //         session.setAttribute("msg", "Registered Successfully");
    //         return "redirect:/signin";
    //     }
    //     return "redirect:/register";
    // }

    // @PostMapping("/login")
    // public String loginUser(@RequestParam("username") String username,
    //                         @RequestParam("password") String password,
    //                         HttpSession session) {
    //     User user = userService.findByUsername(username);
    //     if (user == null) {
    //         session.setAttribute("message", "Invalid username!");
    //         return "redirect:/login";
    //     }
    //     if (user.getPassword().equals(password)) {
    //         SessionListener.getActiveUsers().add(user);
    //         session.setAttribute("user", user);
    //         session.setAttribute("userId", user.getUsername());
    //         return "redirect:/user/room";  
    //     } else {
    //         session.setAttribute("message", "Invalid password!");
    //         return "redirect:/login";
    //     }
    // }
 
    @GetMapping("/")
    public String viewHomepage() {
        return "redirect:"+reactUrl; 
    }

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@ModelAttribute User user, HttpSession session) throws NoSuchAlgorithmException {
        if (userService.checkEmail(user.getEmail())) {
            session.setAttribute("msg", "Email already exists!");
            return new ResponseEntity<>("Email already exists!", HttpStatus.CONFLICT);
        }else if (userService.checkUsername(user.getUsername())) {
            session.setAttribute("msg", "Username already exists!");
            return new ResponseEntity<>("Username already exists!", HttpStatus.CONFLICT);
        }  
        else if (user.getEmail().isEmpty() || user.getFirstName().isEmpty() || user.getLastName().isEmpty() || user.getPassword().isEmpty() || user.getUsername().isEmpty()) {
            session.setAttribute("msg", "All fields are required.");
            return new ResponseEntity<>("All fields are required", HttpStatus.BAD_REQUEST);
        } else {
            String encryptedPassword = PasswordEncryptionUtil.encryptPassword(user.getPassword());
            user.setPassword(encryptedPassword);
            userService.createUser(user);
            session.setAttribute("msg", "Registered Successfully");
            return new ResponseEntity<>(reactUrl+"/login", HttpStatus.CREATED); // Redirect to login page in React
        }
    }
    

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam("username") String username,
                                            @RequestParam("password") String password,
                                            HttpSession session) {
        User user = userService.findByUsername(username);
    
        if (user == null) {
            return new ResponseEntity<>("Invalid username!", HttpStatus.UNAUTHORIZED);
        }
    
        if (PasswordEncryptionUtil.matchPassword(password, user.getPassword())) {
            SessionListener.getActiveUsers().add(user);
            session.setAttribute("user", user);
            session.setAttribute("userId", user.getUsername());
            session.setAttribute("usertime", LocalDateTime.now());
            session.setMaxInactiveInterval(2*60);
    
            // Return the room URL instead of a redirect
            return ResponseEntity.ok("/user/room");
        } else {
            return new ResponseEntity<>("Invalid password!", HttpStatus.UNAUTHORIZED);
        }
    }    

    @GetMapping("/api/get-active-users")
    public ResponseEntity<List<User>> getActiveUsers() {
        Set<User> activeUserSet = SessionListener.getActiveUsers(); 
        List<User> activeUsers = new ArrayList<>(activeUserSet);
    
        if (activeUsers != null && !activeUsers.isEmpty()) {
            return new ResponseEntity<>(activeUsers, HttpStatus.OK); 
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
    

    @GetMapping("/user/room")
    public String userHome(HttpSession session,Model model) {
        User user=(User)session.getAttribute("user");
        if (session.getAttribute("user") == null) {
            return "redirect:/login";  
        }
        model.addAttribute("user",user);
        model.addAttribute("activeusers", SessionListener.getActiveUsers());
        return "user/room";  
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            SessionListener.getActiveUsers().remove(user);
        }
        session.invalidate();  
        return "redirect:"+reactUrl;  
    }
    

    @GetMapping("/room")
    public String getRoom(@RequestParam(value = "room", required = false) String roomCode,HttpSession session, Model model) {
        User user=(User)session.getAttribute("user");
        if (session.getAttribute("user") == null) {
            return "redirect:/login";  
        }
    if (roomCode != null) {
        model.addAttribute("roomCode", roomCode);  // Pass room ID to the template
        // List<User> activeusers=(List<User>) SessionListener.getActiveUsers();
        model.addAttribute("user",user);
        model.addAttribute("activeusers", SessionListener.getActiveUsers());
    } else {
        model.addAttribute("roomCode", "default_room");  // If no roomCode, pass a default
    }
    return "user/room";  // This will return room.html from the templates folder
    }

    // @PostMapping("/api/createOrJoinRoom")
    // public ResponseEntity<?> createOrJoinRoom(@RequestBody Map<String, String> requestData) {
    //     String roomCode = requestData.get("roomCode");
    //     String userId = requestData.get("userId");
    //     Optional<VideoRoom> existingRoom = videoRoomService.findRoomByCode(roomCode);
    //     if (existingRoom.isPresent()) {
    //         VideoRoom videoRoom = existingRoom.get();
    //         List<Participant> participants = participantService.getParticipantsByRoom(videoRoom);
    //         boolean userAlreadyInRoom = participants
    //             .stream()
    //             .anyMatch(participant -> participant.getUserId().equals(userId));
    //         if (userAlreadyInRoom) {
    //             return new ResponseEntity<>("User already in the room", HttpStatus.CONFLICT);
    //         }
    //         Participant participant = participantService.addParticipant(videoRoom, userId, false); // Not an initiator
    //         return new ResponseEntity<>(participant, HttpStatus.CREATED);
    //     }
    //     VideoRoom videoRoom = videoRoomService.createRoom(roomCode);
    //     Participant participant = participantService.addParticipant(videoRoom, userId, true); // Initiator
    //     return new ResponseEntity<>(videoRoom, HttpStatus.CREATED);
    // }

    @PostMapping("/api/createOrJoinRoom")
    public ResponseEntity<?> createOrJoinRoom(@RequestBody Map<String, String> requestData) {
        String roomCode = requestData.get("roomCode");
        String userId = requestData.get("userId");
    
        // Fetch the User object based on userId
        User user = userService.findByUsername(userId);
    
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    
        Optional<VideoRoom> existingRoom = videoRoomService.findRoomByCode(roomCode);
    
        if (existingRoom.isPresent()) {
            VideoRoom videoRoom = existingRoom.get();
    
            List<Participant> participants = participantService.getParticipantsByRoom(videoRoom);
            boolean userAlreadyInRoom = participants
                    .stream()
                    .anyMatch(participant -> participant.getUser().getId() == user.getId());
    
            if (userAlreadyInRoom) {
                return new ResponseEntity<>("User already in the room", HttpStatus.CONFLICT);
            }
    
            Participant participant = participantService.addParticipant(videoRoom, user, false); // Not an initiator
            return new ResponseEntity<>(participant, HttpStatus.CREATED);
        }
    
        VideoRoom videoRoom = videoRoomService.createRoom(roomCode);
    
        Participant participant = participantService.addParticipant(videoRoom, user, true); // Initiator flag is set to true
        return new ResponseEntity<>(videoRoom, HttpStatus.CREATED);
    }
    

    // @PostMapping("/api/leaveRoom")
    // public ResponseEntity<?> leaveRoom(@RequestBody Map<String, String> requestData) {
    //     String roomCode = requestData.get("roomCode");
    //     String userId = requestData.get("userId");
    //     // Find the video room by roomCode
    //     Optional<VideoRoom> videoRoomOptional = videoRoomService.findRoomByCode(roomCode);
    //     if (!videoRoomOptional.isPresent()) {
    //         return new ResponseEntity<>("Room not found", HttpStatus.NOT_FOUND);
    //     }
    //     VideoRoom videoRoom = videoRoomOptional.get();
    //     List<Participant> participants = participantService.getParticipantsByRoom(videoRoom);
    //     Participant participant = participants.stream()
    //             .filter(p -> p.getUserId().equals(userId))
    //             .findFirst()
    //             .orElse(null);
    //     if (participant == null) {
    //                 return new ResponseEntity<>("Participant not found in this room", HttpStatus.NOT_FOUND);
    //     }
    //     List<Participant> remainingParticipants = participantService.getParticipantsByRoom(videoRoom);
    //     List<Participant> activeParticipants = remainingParticipants.stream()
    //             .filter(p -> p.getEndTime() == null)
    //             .collect(Collectors.toList());
    //     if (activeParticipants.size() == 1 && activeParticipants.get(0).getUserId().equals(userId)) {
    //         videoRoomService.updateEndTime(videoRoom);
    //     }
    //     // Set the participant's end time to the current time and save the changes
    //     participantService.updateParticipantEndTime(participant);
    //     return new ResponseEntity<>("User has successfully left the room", HttpStatus.OK);
    // }
    @PostMapping("/api/leaveRoom")
    public ResponseEntity<?> leaveRoom(@RequestBody Map<String, String> requestData) {
        String roomCode = requestData.get("roomCode");
        String userId = requestData.get("userId");
    
        // Find the video room by roomCode
        Optional<VideoRoom> videoRoomOptional = videoRoomService.findRoomByCode(roomCode);
        if (!videoRoomOptional.isPresent()) {
            return new ResponseEntity<>("Room not found", HttpStatus.NOT_FOUND);
        }
    
        VideoRoom videoRoom = videoRoomOptional.get();
    
        User user = userService.findByUsername(userId);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    
        List<Participant> participants = participantService.getParticipantsByRoom(videoRoom);
        Participant participant = participants.stream()
                .filter(p -> p.getUser().getId() == user.getId())
                .findFirst()
                .orElse(null);
    
        if (participant == null) {
            return new ResponseEntity<>("Participant not found in this room", HttpStatus.NOT_FOUND);
        }
    
        List<Participant> activeParticipants = participants.stream()
                .filter(p -> p.getEndTime() == null)
                .collect(Collectors.toList());
    
        if (activeParticipants.size() == 1 && activeParticipants.get(0).getUser().getId() == user.getId()) {
            videoRoomService.updateEndTime(videoRoom);
        }
    
        participantService.updateParticipantEndTime(participant);
    
        return new ResponseEntity<>("User has successfully left the room", HttpStatus.OK);
    }
    
    // @GetMapping("/video-call-history")
    // public String getVideoHistory() {
    //     return "redirect:"+reactUrl+"/video-call-history"; 
    // }
    
    @GetMapping("/user-sessions")
    public ResponseEntity<?> getUserVideoSessions(HttpSession session,
                                                  @RequestParam(required = false) String participantName,
                                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
                                                  @RequestParam(required = false) String sortBy) {
        
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }
    
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;
        if (startDate != null) {
            startDateTime = startDate.atStartOfDay();  // Start of the day (00:00:00)
        }
        if (endDate != null) {
            endDateTime = endDate.atTime(LocalTime.MAX);  // End of the day (23:59:59)
        }
    
        // List<Participant> userParticipants = participantService.getParticipantsByUserAndFilters(
        //     user, participantName, startDateTime, endDateTime, sortBy);
        List<Participant> participants;
        if (user.getRole().equals("ADMIN")) {
            // Fetch all participants regardless of user
            participants = participantService.getParticipantsByFilters(
                participantName, startDateTime, endDateTime, sortBy);
        } else {
            // Fetch only the video sessions that the logged-in user participated in
            participants = participantService.getParticipantsByUserAndFilters(
                user, participantName, startDateTime, endDateTime, sortBy);
        }
    
        List<Map<String, Object>> response = generateVideoCallHistoryResponse(participants);
    
        return ResponseEntity.ok(response);
    }
    
    
    // Generate a formatted response for the video call history
    private List<Map<String, Object>> generateVideoCallHistoryResponse(List<Participant> participants) {
        List<Map<String, Object>> response = new ArrayList<>();
    
        // Group by VideoRoom and build response
        Map<VideoRoom, List<Participant>> groupedByVideoRoom = new HashMap<>();
        
        // Group participants by video room
        for (Participant participant : participants) {
            groupedByVideoRoom
                .computeIfAbsent(participant.getVideoRoom(), k -> new ArrayList<>())
                .add(participant);
        }
    
        // Build response for each VideoRoom
        for (Map.Entry<VideoRoom, List<Participant>> entry : groupedByVideoRoom.entrySet()) {
            VideoRoom videoRoom = entry.getKey();
            List<Participant> roomParticipants = entry.getValue();
    
            Map<String, Object> videoRoomData = new HashMap<>();
            videoRoomData.put("videoId", videoRoom.getVideoId());
            videoRoomData.put("roomCode", videoRoom.getRoomCode());
            videoRoomData.put("startTime", videoRoom.getStartTime());
            videoRoomData.put("endTime", videoRoom.getEndTime());
    
            // Add participants details
            List<Map<String, Object>> participantDetails = new ArrayList<>();
            for (Participant p : roomParticipants) {
                Map<String, Object> participantData = new HashMap<>();
                participantData.put("userId", p.getUser().getUsername());  // Assuming 'getUser' returns a User object
                participantData.put("startTime", p.getStartTime());
                participantData.put("endTime", p.getEndTime());
                participantData.put("isInitiator", p.isInitiatorFlag());
                participantDetails.add(participantData);
            }
    
            videoRoomData.put("participants", participantDetails);
            response.add(videoRoomData);
        }
    
        return response;
    }


    // @GetMapping("/profiledetails")
    // public String getProfile() {
    //     return "redirect:http://localhost:3000/profile"; 
    // }
    

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }

        Map<String, Object> userProfile = new HashMap<>();
        userProfile.put("firstName", user.getFirstName());
        userProfile.put("lastName", user.getLastName());
        userProfile.put("username", user.getUsername());
        userProfile.put("email", user.getEmail());
        userProfile.put("id", user.getId());

        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/api/active-users")
    public ResponseEntity<List<User>> getActiveUsers(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
    
        if (currentUser == null) {
            return ResponseEntity.ok(new ArrayList<>()); // Return empty list if no user is logged in
        }
        
        Set<User> activeUsersSet = SessionListener.getActiveUsers(); 
        
        List<User> activeUsers = activeUsersSet.stream()
            .filter(user -> !user.getUsername().equals(currentUser.getUsername())) // Assuming getUsername() gives the user ID
            .collect(Collectors.toList());
    
        return ResponseEntity.ok(activeUsers); 
    }
    

    //     @GetMapping("/user-sessions-page")
    // public ResponseEntity<Map<String, Object>> getUserVideoSessions(
    //         HttpSession session,
    //         @RequestParam(required = false) String participantName,
    //         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    //         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
    //         @RequestParam(required = false) String sortBy,
    //         @RequestParam(defaultValue = "0") int page,  // default page number 0
    //         @RequestParam(defaultValue = "6") int size   // default page size 6
    // ) {

    //     User user = (User) session.getAttribute("user");
    //     if (user == null) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    //     }

    //     LocalDateTime startDateTime = null;
    //     LocalDateTime endDateTime = null;
    //     if (startDate != null) {
    //         startDateTime = startDate.atStartOfDay();
    //     }
    //     if (endDate != null) {
    //         endDateTime = endDate.atTime(LocalTime.MAX);
    //     }

    //     Pageable pageable = PageRequest.of(page, size);

    //     // Fetch the paginated data from the service
    //     Page<Participant> participantsPage = participantService.getParticipantsByUserFiltersAndPage(user, participantName, startDateTime, endDateTime, sortBy, pageable);

    //     // Prepare the response with pagination info
    //     Map<String, Object> response = new HashMap<>();
    //     response.put("sessions", participantsPage.getContent());
    //     response.put("currentPage", participantsPage.getNumber());
    //     response.put("totalItems", participantsPage.getTotalElements());
    //     response.put("totalPages", participantsPage.getTotalPages());

    //     return ResponseEntity.ok(response);
    // }
    @GetMapping("/user-sessions-page")
public ResponseEntity<Map<String, Object>> getUserVideoSessions(
        HttpSession session,
        @RequestParam(required = false) String participantName,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "6") int size
) {

    User user = (User) session.getAttribute("user");
    if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    }

    LocalDateTime startDateTime = null;
    LocalDateTime endDateTime = null;
    if (startDate != null) {
        startDateTime = startDate.atStartOfDay();
    }
    if (endDate != null) {
        endDateTime = endDate.atTime(LocalTime.MAX);
    }

    Pageable pageable = PageRequest.of(page, size);
    Page<Participant> participantsPage = participantService.getParticipantsByUserFiltersAndPage(
            user, participantName, startDateTime, endDateTime, sortBy, pageable);

    // Convert Participant entities to ParticipantDTOs
    List<ParticipantDTO> participantDTOs = participantsPage.getContent().stream()
            .map(ParticipantDTO::new)
            .collect(Collectors.toList());

    Map<String, Object> response = new HashMap<>();
    response.put("sessions", participantDTOs);
    response.put("currentPage", participantsPage.getNumber());
    response.put("totalItems", participantsPage.getTotalElements());
    response.put("totalPages", participantsPage.getTotalPages());

    return ResponseEntity.ok(response);
}

}
