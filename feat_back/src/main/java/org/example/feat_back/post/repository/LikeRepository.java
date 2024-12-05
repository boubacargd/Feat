package org.example.feat_back.post.repository;
import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.post.entity.Like;
import org.example.feat_back.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostAndUser(Post post, UserEntity user);
    List<Like> findByPost(Post post);
}
