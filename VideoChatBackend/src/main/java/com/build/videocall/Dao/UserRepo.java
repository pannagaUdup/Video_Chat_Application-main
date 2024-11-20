package com.build.videocall.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.build.videocall.Model.User;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {

    public boolean existsByEmail(String email);
    public boolean existsByUsername(String username);
    public User findByUsername(String username);
}
