package org.example.feat_back.authentication.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@RestController
@CrossOrigin("http://localhost:8081/")
@RequestMapping("/api/public")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    private final Key secretKey;

    // Utilisez une clé secrète plus sécurisée et changez-la en production
    private static final String SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // Remplacez ceci par votre vraie clé secrète

    public AuthController() {
        this.secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    @PostMapping("/signin")
    public ResponseEntity<String> signin(@RequestBody UserCredential userCredential) {
        // Valider les entrées
        if (userCredential.email() == null || userCredential.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password must not be null.");
        }

        Authentication authenticationRequest = new UsernamePasswordAuthenticationToken(userCredential.email(), userCredential.password());

        try {
            // Authentifier l'utilisateur
            Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);

            if (authenticationResponse.isAuthenticated()) {
                System.out.println("Logged in!");

                // Récupérer l'utilisateur authentifié
                UserDTO userDTO = userService.getUserByEmail(userCredential.email());

                if (userDTO == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
                }

                Date now = new Date();
                Date expiryDate = new Date(now.getTime() + 864000000); // 10 jours en millisecondes

                // Utiliser l'email de l'utilisateur pour le sujet du JWT
                String jwtToken = Jwts.builder()
                        .setSubject(userDTO.getEmail()) // Utilise l'email dans le sub
                        .claim("email", userDTO.getEmail()) // Inclure l'email comme claim
                        .setIssuedAt(now) // Optionnel : ajoutez la date d'émission
                        .setExpiration(expiryDate) // Ajouter une date d'expiration
                        .signWith(secretKey, SignatureAlgorithm.HS256)
                        .compact();

                HttpHeaders responseHeaders = new HttpHeaders();
                responseHeaders.add("Access-Control-Expose-Headers", "Authorization");
                responseHeaders.add("Authorization", "Bearer " + jwtToken);

                return ResponseEntity.ok().headers(responseHeaders).body(jwtToken);
            }
        } catch (Exception e) {
            System.err.println("Authentication error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    public record UserCredential(String email, String password) {}
}
