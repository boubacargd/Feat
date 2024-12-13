package org.example.feat_back.post.controller;

import org.example.feat_back.post.dto.CommentDTO;
import org.example.feat_back.post.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Récupérer les commentaires d'un post
    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    // Ajouter un commentaire
    @PostMapping("/{postId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDto) {
        return ResponseEntity.ok(commentService.addComment(postId, commentDto));
    }

    // Supprimer un commentaire
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}