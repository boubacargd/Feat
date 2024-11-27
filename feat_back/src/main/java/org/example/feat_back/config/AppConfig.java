package org.example.feat_back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class AppConfig {

    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)  // Désactivation de CSRF (cela peut être géré de manière plus fine selon les besoins)
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(HttpMethod.POST, "/api/posts/create").authenticated()  // Autoriser les utilisateurs authentifiés pour certaines routes
                                .requestMatchers("/**").permitAll()  // Permettre les autres requêtes publiques
                )
                .build(); // Build l'objet HttpSecurity
        return http.build();
    }
}
