package org.example.feat_back.post.controller;

import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.post.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService likeService;

    // Endpoint pour liker/désliker un post
    @PostMapping("/toggle/{postId}/{userId}")
    public boolean toggleLike(@PathVariable Long postId, @PathVariable Long userId) {
        return likeService.toggleLike(postId, userId);
    }

    // Endpoint pour obtenir le nombre de likes d'un post
    @GetMapping("/count/{postId}")
    public long getLikeCount(@PathVariable Long postId) {
        return likeService.getLikeCount(postId);
    }

    // Endpoint pour récupérer les utilisateurs ayant liké un post
    @GetMapping("/users/{postId}")
    public List<UserEntity> getUsersWhoLikedPost(@PathVariable Long postId) {
        return likeService.getUsersWhoLikedPost(postId);
    }

    @GetMapping("/isLiked/{postId}/{userId}")
    public boolean isPostLikedByUser(@PathVariable Long postId, @PathVariable Long userId) {

        try {
            return likeService.isPostLikedByUser(postId, userId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("ID utilisateur invalide");
        }
    }


}
