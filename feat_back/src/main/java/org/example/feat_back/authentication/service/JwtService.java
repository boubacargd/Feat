package org.example.feat_back.authentication.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

@Service
public class JwtService {

    // La clé secrète doit être suffisamment longue pour l'algorithme HS256 (au moins 32 octets)
    private static final String SECRET_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // Exemple de clé plus longue
    private final Set<String> revokedTokens = new HashSet<>();

    private final Key signingKey; // Utilisez Key pour stocker la clé sécurisée

    public JwtService() {
        // Générer une clé sécurisée à partir de la clé secrète
        this.signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // Extraction de l'email/nom d'utilisateur du token JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extraire une réclamation spécifique du token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extraction de toutes les réclamations
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)  // Utilisez la clé signée
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Vérification de la validité du token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && !isTokenRevoked(token));
    }

    // Vérification si le token a expiré
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extraire la date d'expiration du token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Vérifier si le token a été révoqué
    public boolean isTokenRevoked(String token) {
        return revokedTokens.contains(token);
    }



    // Méthode pour révoquer un token
    public void revokeToken(String token) {
        revokedTokens.add(token); // Ajoute le token à la liste des tokens révoqués
    }

    // Générer un token JWT pour un utilisateur
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // Utilise le nom d'utilisateur comme sujet
                .setIssuedAt(new Date(System.currentTimeMillis())) // Date de génération du token
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Expiration dans 10 heures
                .signWith(signingKey, SignatureAlgorithm.HS256) // Utilise la clé secrète sécurisée et l'algorithme HS256
                .compact();
    }
}
