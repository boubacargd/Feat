package org.example.feat_back.authentication.service;

import org.example.feat_back.authentication.user.GoogleUserInfo;
import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.authentication.user.UserEntity;

import java.util.Optional;

public interface UserService {
    UserDTO getUserByEmail(String email);

    Optional<UserDTO> findById(Long id);
    void updateProfileImage(String email, String imagePath);

    // Modifier la méthode pour accepter GoogleUserInfo au lieu de String
    UserEntity createUserFromGoogleToken(GoogleUserInfo userInfo);
}
