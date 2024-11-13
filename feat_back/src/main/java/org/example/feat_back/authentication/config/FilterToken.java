package org.example.feat_back.authentication.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.feat_back.authentication.service.JwtService;
import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class FilterToken extends OncePerRequestFilter {

    private final Key secretKey; // Clé secrète pour valider le JWT
    private final UserService userService; // Service pour charger les utilisateurs
    private final JwtService jwtService; // Service pour gérer les opérations JWT

    @Autowired
    public FilterToken(UserService userService, JwtService jwtService) {
        // Initialiser la clé secrète
        this.secretKey = Keys.hmacShaKeyFor("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c".getBytes(StandardCharsets.UTF_8));
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/uploads/") || requestURI.startsWith("/api/public/")) {
            // Continuer la chaîne de filtres sans authentification
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("Headers:");
        request.getHeaderNames().asIterator().forEachRemaining(header -> System.out.println(header + ": " + request.getHeader(header)));

        final String requestTokenHeader = request.getHeader("Authorization");
        String userId = null; // Déclaration unique de userId
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7); // Extraire le token

            System.out.println("JWT Token: " + jwtToken);
            System.out.println("Secret Key: " + new String(secretKey.getEncoded(), StandardCharsets.UTF_8)); // Ne pas utiliser la clé en production, juste pour le débogage

            // Vérification de la validité du token
            if (jwtService.isTokenRevoked(jwtToken)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token révoqué");
                return; // Arrêter le traitement si le token est révoqué
            }

            try {
                // Décodage et vérification du token
                Claims claims = Jwts.parser()
                        .setSigningKey(secretKey)
                        .parseClaimsJws(jwtToken)
                        .getBody();

                String email = claims.getSubject();  // Récupère le sujet du JWT, censé être l'email
                System.out.println("Email from token: " + email);

                // Vérifiez l'utilisateur en base de données
                UserDTO userDTO = userService.getUserByEmail(email);
                if (userDTO != null) {
                    System.out.println("User found in database: " + userDTO.getEmail());

                    final UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDTO,
                                    null,
                                    userDTO.getAuthorities()
                            );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    System.out.println("User not found: " + email);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                    return; // Arrêter le traitement si l'utilisateur n'est pas trouvé
                }

            } catch (Exception e) {
                System.err.println("Invalid token: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return; // Arrêter le traitement si le token est invalide
            }



        } else {
            System.out.println("No Authorization header found");
        }



        // Continuer le filtrage de la requête
        filterChain.doFilter(request, response);
    }


}


