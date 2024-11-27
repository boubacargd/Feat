package org.example.feat_back.authentication.user;

public class GoogleUserInfo {
    private String email;
    private String userId;
    private String name;
    private String picture;

    public String getEmail() {
        return email;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getPicture() {
        return picture;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
