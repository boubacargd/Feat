package org.example.feat_back.authentication.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;

public class UserDTO implements UserDetails {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // L'attribut password doit être ici
    private String activities; // Type modifié en String
    private String country;
    private String imageUrl;
    private Collection<? extends GrantedAuthority> authorities;

    private boolean accountNonExpired = true;
    private boolean accountNonLocked = true;
    private boolean credentialsNonExpired = true;
    private boolean enabled = true;

    // Constructeur par défaut
    public UserDTO() {}

    // Constructeur avec tous les paramètres
    public UserDTO(Long id, String firstName, String lastName, String email, String password, String activities, String country, String imageUrl) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password; // Doit correspondre à l'attribut
        this.activities = activities; // Modifié pour accepter un String
        this.country = country;
        this.imageUrl = imageUrl;
    }

    // Constructeur à partir de UserEntity
    public UserDTO(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.firstName = userEntity.getFirstName();
        this.lastName = userEntity.getLastName();
        this.email = userEntity.getEmail();
        this.password = userEntity.getPassword(); // A manipuler avec précaution
        this.activities = userEntity.getActivities(); // Modifié pour correspondre à un String
        this.country = userEntity.getCountry();
        this.imageUrl = userEntity.getImageUrl();
        this.authorities = userEntity.getAuthorities();
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
        return password; // Assurez-vous que cela retourne l'attribut password correctement
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getActivities() {
        return activities; // Récupérer activities comme un String
    }

    public void setActivities(String activities) {
        this.activities = activities; // Setter modifié pour String
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
        return email; // Retourne l'email comme nom d'utilisateur
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
}
