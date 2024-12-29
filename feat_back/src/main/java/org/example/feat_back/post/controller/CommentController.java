package org.example.feat_back.post.controller;

import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.post.dto.CommentDTO;
import org.example.feat_back.post.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId) {
        logger.debug("Récupération des commentaires pour le postId: {}", postId);

        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        if (comments.isEmpty()) {
            logger.warn("Aucun commentaire trouvé pour le postId: {}", postId);
        } else {
            comments.forEach(comment -> logger.debug("Commentaire trouvé: {}", comment));
        }

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{postId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDto) {
        commentDto.setPostId(postId);
        CommentDTO savedComment = commentService.addComment(postId, commentDto);
        return ResponseEntity.ok(savedComment);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/userDetails/{userId}")
    public ResponseEntity<UserDTO> getUserDetails(@PathVariable Long userId) {
        UserDTO userDetails = userService.getUserById(userId);
        return ResponseEntity.ok(userDetails);
    }
}
