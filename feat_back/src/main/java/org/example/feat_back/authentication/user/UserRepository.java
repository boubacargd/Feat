package org.example.feat_back.authentication.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    @Modifying
    @Query("UPDATE UserEntity u SET u.imageUrl = :imagePath WHERE u.email = :email")
    void imageUrl(@Param("email") String email, @Param("imagePath") String imagePath);
    UserDTO findUserNameByEmail(String email);
}
