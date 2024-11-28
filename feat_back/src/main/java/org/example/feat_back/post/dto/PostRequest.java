package org.example.feat_back.post.dto;

import java.util.List;

public class PostRequest {
    private String content;
    private List<String> imageUrl;  // Liste des URLs

    // Getters et setters
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
}


