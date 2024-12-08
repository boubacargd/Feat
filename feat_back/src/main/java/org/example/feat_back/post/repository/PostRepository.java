package org.example.feat_back.post.repository;

import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(UserEntity user);
    List<Post> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.id = :postId")
    Optional<Post> findPostWithUserImage(@Param("postId") Long postId);

    @Query("SELECT p FROM Post p WHERE p.user = :user ORDER BY p.createdAt DESC")
    List<Post> findByUserOrderByCreatedAtDesc(@Param("user") UserEntity user);
}