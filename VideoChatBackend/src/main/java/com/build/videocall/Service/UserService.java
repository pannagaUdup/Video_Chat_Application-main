package com.build.videocall.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.build.videocall.Dao.UserRepo;
import com.build.videocall.Model.User;

@Service
public class UserService {
    @Autowired
    UserRepo userRepo;
    public boolean checkEmail(String email){
        return userRepo.existsByEmail(email);
    }

    public boolean checkUsername(String username){
        return userRepo.existsByUsername(username);
    }

    public User findByUsername(String username){
        return userRepo.findByUsername(username);
    }

    public User createUser(User user) {
        return userRepo.save(user);
    }
}
