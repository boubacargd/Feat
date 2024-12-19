package org.example.feat_back.authentication.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.GoogleUserInfo;
import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.authentication.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

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
                        .setSubject(userDTO.getEmail())
                        .claim("userId", userDTO.getId()) // Utilise l'ID récupéré via getUserByEmail
                        .claim("email", userDTO.getEmail()) // Inclure l'email comme claim
                        .claim("userName", userDTO.getFirstName() + " " + userDTO.getLastName() )
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

    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> verifyGoogleToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        // URL pour valider le token Google
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + token;

        // Envoyer la requête à Google
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || response.get("email") == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid Google token"));
        }

        // Extraire les informations utilisateur
        GoogleUserInfo userInfo = new GoogleUserInfo();
        userInfo.setEmail((String) response.get("email"));
        userInfo.setUserId((String) response.get("sub"));
        userInfo.setName((String) response.get("name"));
        userInfo.setPicture((String) response.get("picture"));

        // Vérifier l'existence de l'utilisateur dans la base de données
        UserEntity userEntity = userService.createUserFromGoogleToken(userInfo);

        // Convertir UserEntity en UserDTO
        UserDTO userDTO = new UserDTO(userEntity);

        // Créer un JWT pour l'utilisateur authentifié
        String jwtToken = Jwts.builder()
                .setSubject(userInfo.getEmail())
                .claim("email", userInfo.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 864000000)) // Expiration dans 10 jours
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add("Authorization", "Bearer " + jwtToken);

        // Renvoyer le JWT et les informations de l'utilisateur
        return ResponseEntity.ok().headers(responseHeaders).body(Map.of("jwt", jwtToken, "user", userDTO));
    }

}
