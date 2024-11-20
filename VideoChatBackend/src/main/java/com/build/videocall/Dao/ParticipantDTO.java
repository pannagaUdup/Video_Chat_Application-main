package com.build.videocall.Dao;

import java.time.LocalDateTime;

import com.build.videocall.Model.Participant;

public class ParticipantDTO {
    private Long participantId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean isInitiator;

    // Constructor and Getters/Setters
    public ParticipantDTO(Participant participant) {
        this.participantId = participant.getParticipantId();
        this.userId = participant.getUser().getUsername();
        this.startTime = participant.getStartTime();
        this.endTime = participant.getEndTime();
        this.isInitiator = participant.isInitiatorFlag();
    }

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public boolean isInitiator() {
        return isInitiator;
    }

    public void setInitiator(boolean isInitiator) {
        this.isInitiator = isInitiator;
    }
}

