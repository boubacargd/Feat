package org.example.feat_back.post.service;

import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.authentication.user.UserRepository;
import org.example.feat_back.post.entity.Like;
import org.example.feat_back.post.entity.Post;
import org.example.feat_back.post.repository.LikeRepository;
import org.example.feat_back.post.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    // Méthode pour ajouter ou supprimer un like (toggle)
    public boolean toggleLike(Long postId, Long userId) {
        // Récupérer le post et l'utilisateur
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));

        // Vérifier si l'utilisateur a déjà liké le post
        Optional<Like> existingLike = likeRepository.findByPostAndUser(post, user);

        if (existingLike.isPresent()) {
            // Si le like existe, le supprimer
            likeRepository.delete(existingLike.get());
            return false; // Le like a été supprimé
        } else {
            // Sinon, ajouter un nouveau like
            Like newLike = new Like();
            newLike.setPost(post);
            newLike.setUser(user);
            likeRepository.save(newLike);
            return true; // Le like a été ajouté
        }
    }

    // Méthode pour obtenir le nombre de likes d'un post
    public long getLikeCount(Long postId) {
        // Récupérer le post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));

        // Retourner le nombre de likes
        return post.getLikes().size(); // Renvoie la taille de la liste des likes
    }

    // Méthode pour obtenir la liste des utilisateurs ayant liké un post
    public List<UserEntity> getUsersWhoLikedPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));

        // Récupérer tous les utilisateurs ayant liké le post
        return likeRepository.findByPost(post).stream()
                .map(Like::getUser)
                .toList();
    }

    // Méthode pour vérifier si un utilisateur a liké un post
    public boolean isPostLikedByUser(Long postId, Long userId) {
        // Récupérer le post et l'utilisateur
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id " + userId + " not found"));

        // Vérifier si un like existe pour ce post et cet utilisateur
        return likeRepository.findByPostAndUser(post, user).isPresent();
    }

}
