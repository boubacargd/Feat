package org.example.feat_back.authentication.service;

import org.example.feat_back.authentication.user.GoogleUserInfo;
import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.authentication.user.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDTO getUserByEmail(String email);
    UserDTO getUserById(Long id);
    void updateProfileImage(String email, String imagePath);
    List<UserDTO> getUsersByIds(List<Long> userIds);
    UserEntity createUserFromGoogleToken(GoogleUserInfo userInfo);
    UserDTO getUserName(String email);
}
