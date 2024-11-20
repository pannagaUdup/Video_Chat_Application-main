package com.build.videocall.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.build.videocall.Dao.VideoRoomRepository;
import com.build.videocall.Model.VideoRoom;


@Service
public class VideoRoomService {

    @Autowired
    private VideoRoomRepository videoRoomRepository;

    // Method to create a new Video Room
    public VideoRoom createRoom(String roomCode) {
        VideoRoom videoRoom = new VideoRoom();
        videoRoom.setRoomCode(roomCode);
        videoRoom.setStartTime(LocalDateTime.now());
        return videoRoomRepository.save(videoRoom);
    }

    // Method to find a Video Room by its room code
    public Optional<VideoRoom> findRoomByCode(String roomCode) {
        return videoRoomRepository.findByRoomCode(roomCode);
    }

    // Method to update the end time of a Video Room
    public VideoRoom updateEndTime(VideoRoom videoRoom) {
        videoRoom.setEndTime(LocalDateTime.now());
        return videoRoomRepository.save(videoRoom);
    }

}
