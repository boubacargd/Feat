package org.example.feat_back.post.service;

import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.post.dto.CommentDTO;
import org.example.feat_back.post.entity.Comment;
import org.example.feat_back.post.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserService userService;

    public CommentDTO addComment(Long postId, CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(commentDTO.getUserId());

        // Récupérer le nom de l'utilisateur ici
        UserDTO userDTO = userService.getUserById(commentDTO.getUserId());
        if (userDTO != null) {
            comment.setUserName(userDTO.getFirstName() + " " + userDTO.getLastName());
        } else {
            comment.setUserName("Utilisateur inconnu");  // Valeur par défaut
        }

        comment.setContent(commentDTO.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        comment = commentRepository.save(comment);

        return convertToDTO(comment);
    }

    public List<CommentDTO> getCommentsByPostId(Long postId) {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.debug("Recherche des commentaires dans la base pour le postId: {}", postId);

        List<Comment> comments = commentRepository.findByPostId(postId);
        if (comments.isEmpty()) {
            logger.warn("Aucun commentaire trouvé dans la base pour le postId: {}", postId);
            return List.of();
        }

        logger.debug("Commentaires bruts trouvés: {}", comments);

        // Récupérer les IDs d'utilisateur
        List<Long> userIds = comments.stream()
                .map(Comment::getUserId)
                .distinct()
                .collect(Collectors.toList());

        logger.debug("Liste des IDs utilisateurs associés: {}", userIds);

        // Récupérer les détails des utilisateurs
        Map<Long, UserDTO> userDetails = userService.getUsersByIds(userIds).stream()
                .collect(Collectors.toMap(UserDTO::getId, user -> user));

        logger.debug("Détails des utilisateurs récupérés: {}", userDetails);

        return comments.stream().map(comment -> {
            CommentDTO dto = new CommentDTO();
            dto.setId(comment.getId());
            dto.setPostId(comment.getPostId());
            dto.setUserId(comment.getUserId());
            dto.setContent(comment.getContent());
            dto.setCreatedAt(comment.getCreatedAt());

            UserDTO user = userDetails.get(comment.getUserId());
            if (user != null) {
                dto.setUserName(user.getFirstName() + " " + user.getLastName());
            } else {
                dto.setUserName("Utilisateur inconnu");
            }

            logger.debug("Commentaire enrichi: {}", dto);
            return dto;
        }).collect(Collectors.toList());
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
