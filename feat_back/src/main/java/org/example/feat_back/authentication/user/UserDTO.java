package org.example.feat_back.authentication.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserDTO implements UserDetails {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String activities;
    private String country;
    private String imageUrl;

    // Google Info
    private String name;
    private String profileImage;
    private String googleId;
    private Collection<? extends GrantedAuthority> authorities;

    private boolean accountNonExpired = true;
    private boolean accountNonLocked = true;
    private boolean credentialsNonExpired = true;
    private boolean enabled = true;

    // Constructeur avec tous les paramètres nécessaires
    public UserDTO(Long id, String firstName, String lastName, String email,
                   String activities, String country, String imageUrl, String name) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activities = activities;
        this.country = country;
        this.imageUrl = imageUrl;
        this.name = name;
    }



    // Constructeur sans mot de passe pour des raisons de sécurité
    public UserDTO(Long id, String firstName, String lastName, String email,
                   String activities, String country, String imageUrl) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activities = activities;
        this.country = country;
        this.imageUrl = imageUrl;
    }

    // Constructeur à partir de UserEntity
    public UserDTO(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.firstName = userEntity.getFirstName();
        this.lastName = userEntity.getLastName();
        this.email = userEntity.getEmail();
        this.password = userEntity.getPassword();
        this.activities = userEntity.getActivities();
        this.country = userEntity.getCountry();
        this.imageUrl = userEntity.getImageUrl();
        this.authorities = userEntity.getAuthorities();
        // Si vous souhaitez inclure les informations Google, vous pouvez les ajouter
        this.name = userEntity.getName();
        this.profileImage = userEntity.getProfileImage();
        this.googleId = userEntity.getGoogleId();
    }

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getActivities() {
        return activities;
    }

    public void setActivities(String activities) {
        this.activities = activities;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Méthodes de UserDetails

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    public void setAccountNonExpired(boolean accountNonExpired) {
        this.accountNonExpired = accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    public void setCredentialsNonExpired(boolean credentialsNonExpired) {
        this.credentialsNonExpired = credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    // Getters et Setters pour Google
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }
}
