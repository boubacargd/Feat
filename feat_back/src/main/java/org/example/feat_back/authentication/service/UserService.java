package org.example.feat_back.authentication.service;

import org.example.feat_back.authentication.user.UserDTO;

import java.util.Optional;

public interface UserService {
    UserDTO getUserByEmail(String email);
    Optional<UserDTO> findById(Long id);

    void updateProfileImage(String email, String imagePath);
}
