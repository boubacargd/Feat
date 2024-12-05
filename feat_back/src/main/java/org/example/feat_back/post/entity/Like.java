package org.example.feat_back.post.entity;

import jakarta.persistence.*;
import org.example.feat_back.authentication.user.UserEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_like")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;  // Référence vers le post

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;  // Référence vers l'utilisateur qui aime le post

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
