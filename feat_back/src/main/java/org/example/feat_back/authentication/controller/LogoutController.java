package org.example.feat_back.authentication.controller;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.example.feat_back.authentication.service.JwtService;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class LogoutController {
    private final SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();
    private final JwtService jwtService; // Ajouter une dépendance à JwtService

    public LogoutController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        // Invalidons la session si elle existe
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // Récupérer le token à partir des en-têtes de la requête
        String requestTokenHeader = request.getHeader("Authorization");
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7); // Extraire le token
        }

        // Révoquer le token
        if (jwtToken != null) {
            jwtService.revokeToken(jwtToken);
            System.out.println("Token révoqué: " + jwtToken);
        }

        // Message de succès dans la console
        System.out.println("Utilisateur déconnecté");

        // Retourner un message de succès
        return "Déconnexion réussie";
    }
}
