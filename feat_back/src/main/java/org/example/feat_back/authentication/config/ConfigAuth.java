package org.example.feat_back.authentication.config;

import io.jsonwebtoken.security.Keys;
import org.example.feat_back.authentication.service.JwtService;
import org.example.feat_back.authentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class ConfigAuth {

    private static final String SECRET = "veyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    // Générer la clé pour JWT
    public static Key getSecretKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;

    @Autowired
    @Lazy
    private UserService userService;

    @Autowired
    @Lazy
    private JwtService jwtService;

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(10, new SecureRandom("password".getBytes(StandardCharsets.UTF_8)));
    }

    // Configuration du filtre de sécurité principal
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Créer une instance de FilterToken avec UserService et JwtService
        FilterToken filterToken = new FilterToken(userService, jwtService);

        return http
                .addFilterBefore(filterToken, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/public/**").permitAll()  // Routes publiques
                        .requestMatchers("/api/images/upload").permitAll()  // Téléchargement d'images autorisé
                        .requestMatchers("/uploads/**").permitAll()  // Accès aux fichiers téléchargés
                        .requestMatchers("/api/user/**").authenticated()  // Authentification requise pour certaines routes
                        .anyRequest().authenticated()  // Toute autre route nécessite une authentification
                )
                .logout(logout -> logout.logoutSuccessUrl("/api/public/**"))
                .csrf(csrf -> csrf.disable())  // Désactiver CSRF (compliant avec Spring Security 6)
                .httpBasic(httpBasic -> httpBasic.disable())  // Désactiver HTTP Basic
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // Pas de session, API stateless
                .build();
    }

    // Configuration CORS pour autoriser les requêtes venant de certains domaines
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8081")); // Origines autorisées
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Méthodes autorisées
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept")); // Headers autorisés
        configuration.setAllowCredentials(true); // Autoriser les cookies et les credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Appliquer CORS à toutes les routes
        return source;
    }

    // Enregistrer le filtre CORS avec la priorité la plus élevée
    @Bean
    public FilterRegistrationBean<CorsFilter> processCorsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:8081")); // Origines autorisées
        config.addAllowedHeader("*"); // Autoriser tous les headers
        config.addAllowedMethod("*"); // Autoriser toutes les méthodes

        source.registerCorsConfiguration("/api/public/**", config);
        source.registerCorsConfiguration("/api/images/upload", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE); // Priorité la plus élevée pour le filtre CORS
        return bean;
    }
}
