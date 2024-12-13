package org.example.feat_back.post.repository;

import org.example.feat_back.post.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Récupérer tous les commentaires d'un post spécifique
    List<Comment> findByPostId(Long postId);
}
