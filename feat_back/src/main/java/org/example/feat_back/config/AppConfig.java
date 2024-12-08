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
                .csrf(AbstractHttpConfigurer::disable)  // Désactivation de CSRF (à ajuster selon les besoins)
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()  // Par exemple pour les ressources publiques
                                .requestMatchers(HttpMethod.POST, "/api/posts/create").authenticated()  // Créer des posts
                                .requestMatchers(HttpMethod.GET, "/api/posts/**").authenticated() // Accès aux posts (en lecture)
                                .requestMatchers("/**").permitAll()  // Permettre toutes les autres routes publiques
                )
                .build(); // Construction de l'objet HttpSecurity

        return http.build();
    }
}
