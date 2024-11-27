package org.example.feat_back.post.service;


import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.post.dto.PostDTO;
import org.example.feat_back.post.entity.Post;
import org.example.feat_back.post.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    // Créer un post
    public PostDTO createPost(PostDTO postDTO, UserEntity user) {
        Post post = new Post();
        post.setContent(postDTO.getContent());
        post.setImageUrl(postDTO.getImageUrl());
        post.setUser(user); // Relier le post à l'utilisateur connecté

        Post savedPost = postRepository.save(post);
        return new PostDTO(savedPost);
    }

    // Récupérer tous les posts
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
    }

    private PostDTO convertToPostDTO(Post post) {
        // Créer et retourner un objet PostDTO
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setContent(post.getContent());
        postDTO.setImageUrl(post.getImageUrl());
        postDTO.setUserName(post.getUser().getFirstName() + " " + post.getUser().getLastName()); // Prendre le nom complet de l'utilisateur
        postDTO.setUserImageUrl(post.getUser().getImageUrl());
        return postDTO;
    }

    public List<PostDTO> getPostsByUser(UserEntity user) {
        // Récupérer les posts depuis le repository
        List<Post> userPosts = postRepository.findByUser(user);

        // Convertir les entités Post en DTOs
        return userPosts.stream().map(this::convertToPostDTO).toList();
    }


    // Récupérer un post par ID
    public PostDTO getPostById(Long postId) {
        Post post = postRepository.findPostWithUserImage(postId)
                .orElseThrow(() -> new RuntimeException("Post introuvable."));

        // Créer et retourner un PostDTO
        return new PostDTO(post);
    }

    // Supprimer un post
    public void deletePost(Long postId, UserEntity user) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post introuvable."));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'avez pas l'autorisation de supprimer ce post.");
        }

        postRepository.delete(post);
    }
}
