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
        post.setImageUrls(postDTO.getImageUrl());
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        return new PostDTO(savedPost);
    }
    public List<PostDTO> getPostsByUserOrdered(UserEntity user) {
        List<Post> userPosts = postRepository.findByUserOrderByCreatedAtDesc(user);
        return userPosts.stream()
                .map(PostDTO::new)
                .collect(Collectors.toList());
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
        postDTO.setImageUrl(post.getImageUrls());
        postDTO.setUserName(post.getUser().getFirstName() + " " + post.getUser().getLastName()); // Prendre le nom complet de l'utilisateur
        postDTO.setUserImageUrl(post.getUser().getImageUrl());
        return postDTO;
    }

    public List<PostDTO> getPostsByUser(UserEntity user) {
        // Récupérer les posts depuis le repository
        List<Post> userPosts = postRepository.findByUser(user);
        return userPosts.stream().map(post -> new PostDTO(post)).collect(Collectors.toList());
    }

    public PostDTO getPostById(Long postId) {
        Post post = postRepository.findPostWithUserImage(postId)
                .orElseThrow(() -> new RuntimeException("Post introuvable."));
        return new PostDTO(post);
    }

    // Supprimer un post
    public void deletePost(Long postId, UserEntity user) {
        // Vérifier si le post existe
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post non trouvé"));
        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce post.");
        }
        postRepository.delete(post);
    }

}
