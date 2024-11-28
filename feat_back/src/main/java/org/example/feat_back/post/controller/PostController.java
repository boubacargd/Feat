package org.example.feat_back.post.controller;


import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.authentication.user.UserRepository;
import org.example.feat_back.post.dto.PostDTO;
import org.example.feat_back.post.dto.PostRequest;
import org.example.feat_back.post.entity.Post;
import org.example.feat_back.post.repository.PostRepository;
import org.example.feat_back.post.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody PostRequest postRequest, Principal principal) {
        try {
            // Récupérer l'email depuis le Principal
            String email = principal.getName();

            // Trouver l'utilisateur connecté dans la base de données
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Créer un nouvel objet Post
            Post post = new Post();
            post.setContent(postRequest.getContent());
            post.setImageUrls(postRequest.getImageUrl());  // Assurez-vous que vous définissez le bon champ

            post.setUser(user); // Associe l'utilisateur attaché

            // Sauvegarder le post
            postRepository.save(post);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post créé avec succès !");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la création du post.");
        }
    }


    // Récupérer tous les posts
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Récupérer les posts d'un utilisateur spécifique
    @GetMapping("/user")
    public ResponseEntity<List<PostDTO>> getUserPosts(Principal principal) {
        try {
            // Récupérer l'email de l'utilisateur connecté
            String email = principal.getName();

            // Trouver l'utilisateur dans la base de données
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Récupérer les posts de cet utilisateur
            List<PostDTO> userPosts = postService.getPostsByUser(user);

            return ResponseEntity.ok(userPosts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Récupérer un post par ID
    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long postId) {
        PostDTO post = postService.getPostById(postId);
        return ResponseEntity.ok(post);
    }

    // Supprimer un post
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, Principal principal) {
        try {
            // Récupérer l'utilisateur connecté depuis le Principal
            String email = principal.getName(); // L'email de l'utilisateur authentifié
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Appeler le service pour supprimer le post
            postService.deletePost(postId, user);

            return ResponseEntity.ok("Post supprimé avec succès.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur lors de la suppression du post.");
        }
    }


}
