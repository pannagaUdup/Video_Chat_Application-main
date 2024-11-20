package com.build.videocall.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.build.videocall.Dao.ParticipantRepository;
import com.build.videocall.Model.Participant;
import com.build.videocall.Model.User;
import com.build.videocall.Model.VideoRoom;

@Service
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    // Method to add a new participant to a Video Room
    public Participant addParticipant(VideoRoom videoRoom, User user, boolean isInitiator) {
        Participant participant = new Participant();
        participant.setVideoRoom(videoRoom);
        participant.setUser(user);
        participant.setStartTime(LocalDateTime.now());
        participant.setInitiatorFlag(isInitiator);
        return participantRepository.save(participant);
    }

    // Method to update the end time for a participant
    public Participant updateParticipantEndTime(Participant participant) {
        participant.setEndTime(LocalDateTime.now());
        return participantRepository.save(participant);
    }
    
    public List<Participant> getParticipantsByUser(User user){
        return participantRepository.findByUser(user);
    }

    public List<Participant> getParticipantsByRoom(VideoRoom videoRoom) {
        return participantRepository.findByVideoRoom(videoRoom);
    }

    public List<Participant> getParticipantsByUserAndFilters(User user, String participantName, LocalDateTime startDateTime, LocalDateTime endDateTime, String sortBy) {
        return participantRepository.findByUserAndFilters(user, participantName, startDateTime, endDateTime, sortBy);
    }

    public List<Participant> getParticipantsByFilters(String participantName, LocalDateTime startDateTime, LocalDateTime endDateTime, String sortBy){
        return participantRepository.findByFilters(participantName, startDateTime, endDateTime, sortBy);

    }

    public Page<Participant> getParticipantsByUserFiltersAndPage(User user, String participantName, 
    LocalDateTime startDateTime, 
    LocalDateTime endDateTime, 
    String sortBy, 
    Pageable pageable) {
    return participantRepository.findByUserFiltersAndPage(user, participantName, startDateTime, endDateTime, sortBy, pageable);
    }

}
