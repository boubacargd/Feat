package org.example.feat_back.post.service;

import org.example.feat_back.post.dto.CommentDTO;
import org.example.feat_back.post.entity.Comment;
import org.example.feat_back.post.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // Ajouter un commentaire
    public CommentDTO addComment(Long postId, CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(commentDTO.getUserId());
        comment.setUserName(commentDTO.getUserName());
        comment.setContent(commentDTO.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        comment = commentRepository.save(comment);

        return convertToDTO(comment);
    }

    // Récupérer tous les commentaires pour un post
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Supprimer un commentaire
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    // Convertir un modèle Comment en DTO
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setPostId(comment.getPostId());
        commentDTO.setUserId(comment.getUserId());
        commentDTO.setUserName(comment.getUserName());
        commentDTO.setContent(comment.getContent());
        commentDTO.setCreatedAt(comment.getCreatedAt());
        return commentDTO;
    }
}
