package com.build.videocall.Dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.build.videocall.Model.VideoRoom;


public interface VideoRoomRepository extends JpaRepository<VideoRoom, Long> {
    Optional<VideoRoom> findByRoomCode(String roomCode);
}
