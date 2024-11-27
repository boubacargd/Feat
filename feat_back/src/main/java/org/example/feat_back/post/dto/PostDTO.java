package org.example.feat_back.post.dto;

import org.example.feat_back.post.entity.Post;

public class PostDTO {
    private Long id;
    private String content;
    private String imageUrl;
    private String userName;
    private String userImageUrl; // URL de l'image de profil de l'utilisateur

    // Constructeur par défaut
    public PostDTO() {}

    // Constructeur à partir de l'entité Post
    public PostDTO(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.imageUrl = post.getImageUrl();
        this.userName = post.getUser().getUsername(); // Inclure le nom de l'utilisateur
        System.out.println("User Image URL: " + userImageUrl); // Ajoutez un log pour déboguer
        this.userImageUrl = imageUrl;     }

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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
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
