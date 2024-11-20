package com.build.videocall.Model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "VideoRoom",schema = "TRAINING_PANNAGA")
public class VideoRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long videoId;
    @Column(nullable = false, unique = true)
    private String roomCode;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @OneToMany(mappedBy = "videoRoom", cascade = CascadeType.ALL)
    private List<Participant> participants = new ArrayList<>();

}
