package org.example.feat_back.post.dto;

import org.example.feat_back.post.entity.Post;

import java.util.List;

public class PostDTO {
    private Long id;
    private String content;
    private List<String> imageUrl;  // Liste des URLs des images du post
    private String userName;
    private String userImageUrl; // URL de l'image de profil de l'utilisateur

    // Constructeur par défaut
    public PostDTO() {}

    // Constructeur à partir de l'entité Post
    public PostDTO(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.imageUrl = post.getImageUrls();  // Liste des URLs des images du post
        this.userName = post.getUser().getUsername();
        this.userImageUrl = post.getUser().getImageUrl(); // Assurez-vous d'avoir un champ userImageUrl dans UserEntity
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(List<String> imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }
}
