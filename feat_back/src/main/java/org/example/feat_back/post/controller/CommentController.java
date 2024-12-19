package org.example.feat_back.post.controller;

import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.post.dto.CommentDTO;
import org.example.feat_back.post.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId) {
        Logger logger = LoggerFactory.getLogger(getClass());  // Initialisation du logger
        logger.debug("Récupération des commentaires pour le postId: {}", postId);  // Log du postId

        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);

        if (comments.isEmpty()) {
            logger.debug("Aucun commentaire trouvé pour le postId: {}", postId);
        } else {
            logger.debug("Commentaires récupérés: {}", comments.size());
        }

        for (CommentDTO commentDTO : comments) {
            logger.debug("Traitement du commentaire ID: {}", commentDTO.getId());  // Log de chaque commentaire

            UserDTO userDTO = userService.getUserById(commentDTO.getUserId());
            if (userDTO != null) {
                logger.debug("Utilisateur trouvé pour le commentaire ID {}: {} {}", commentDTO.getId(), userDTO.getFirstName(), userDTO.getLastName());
                commentDTO.setUserName(userDTO.getFirstName() + " " + userDTO.getLastName());
            } else {
                logger.debug("Utilisateur non trouvé pour le commentaire ID: {}", commentDTO.getId());
            }
        }

        return ResponseEntity.ok(comments);
    }

    // Ajouter un commentaire
    @PostMapping("/{postId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDto) {
        // Vérifier que le commentDto contient bien le postId
        commentDto.setPostId(postId); // Assurez-vous que postId est bien associé au commentaire
        CommentDTO savedComment = commentService.addComment(postId, commentDto);
        return ResponseEntity.ok(savedComment);
    }

    // Supprimer un commentaire
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userDetails")
    public ResponseEntity<UserDTO> getUserDetails() {
        return null;
    }
}