package com.build.videocall.Dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.build.videocall.Model.Participant;
import com.build.videocall.Model.User;
import com.build.videocall.Model.VideoRoom;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByVideoRoom(VideoRoom videoRoom);
    List<Participant> findByUser(User user);

    @Query("SELECT p FROM Participant p WHERE p.videoRoom IN " +
    "(SELECT pr.videoRoom FROM Participant pr WHERE pr.user = :user) " +
    "AND (:participantName IS NULL OR p.videoRoom IN " +
    "(SELECT pr2.videoRoom FROM Participant pr2 WHERE pr2.user.username LIKE %:participantName%)) " +
    "AND (:startDateTime IS NULL OR p.startTime >= :startDateTime) " +
    "AND (:endDateTime IS NULL OR p.endTime <= :endDateTime) " +
    "ORDER BY " +
    "CASE WHEN :sortBy = 'startTime' THEN p.startTime END ASC, " +
    "CASE WHEN :sortBy = 'endTime' THEN p.endTime END ASC"
    )
    List<Participant> findByUserAndFilters(@Param("user") User user,
                                    @Param("participantName") String participantName,
                                    @Param("startDateTime") LocalDateTime startDateTime,
                                    @Param("endDateTime") LocalDateTime endDateTime,
                                    @Param("sortBy") String sortBy);  //no pagination




    @Query("SELECT p FROM Participant p " +
    "WHERE (:participantName IS NULL OR p.videoRoom IN " +
    "(SELECT pr.videoRoom FROM Participant pr WHERE pr.user.username LIKE %:participantName%)) " +
    "AND (:startDateTime IS NULL OR p.startTime >= :startDateTime) " +
    "AND (:endDateTime IS NULL OR p.endTime <= :endDateTime) " +
    "ORDER BY " +
    "CASE WHEN :sortBy = 'startTime' THEN p.startTime END ASC, " +
    "CASE WHEN :sortBy = 'endTime' THEN p.endTime END ASC")
    List<Participant> findByFilters(@Param("participantName") String participantName,
                                @Param("startDateTime") LocalDateTime startDateTime,
                                @Param("endDateTime") LocalDateTime endDateTime,
                                @Param("sortBy") String sortBy);   //Admin 
                             

    @Query("SELECT p FROM Participant p WHERE p.videoRoom IN " +
    "(SELECT pr.videoRoom FROM Participant pr WHERE pr.user = :user) " +
    "AND (:participantName IS NULL OR p.videoRoom IN " +
    "(SELECT pr2.videoRoom FROM Participant pr2 WHERE pr2.user.username LIKE %:participantName%)) " +
    "AND (:startDateTime IS NULL OR p.startTime >= :startDateTime) " +
    "AND (:endDateTime IS NULL OR p.endTime <= :endDateTime) " +
    "ORDER BY " +
    "CASE WHEN :sortBy = 'startTime' THEN p.startTime END ASC, " +
    "CASE WHEN :sortBy = 'endTime' THEN p.endTime END ASC")
    Page<Participant> findByUserFiltersAndPage(@Param("user") User user,
                                            @Param("participantName") String participantName,
                                            @Param("startDateTime") LocalDateTime startDateTime,
                                            @Param("endDateTime") LocalDateTime endDateTime,
                                            @Param("sortBy") String sortBy,
                                            Pageable pageable);   //Pagination

                                            
}

