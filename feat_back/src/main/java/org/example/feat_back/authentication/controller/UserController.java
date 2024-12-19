package org.example.feat_back.authentication.controller;

import org.example.feat_back.authentication.service.UserService;
import org.example.feat_back.authentication.user.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RestController
@RequestMapping("/api/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        // Log pour vérifier l'email reçu
        logger.debug("Email reçu pour récupérer les détails de l'utilisateur: {}", email);

        // Récupérer l'utilisateur par email
        UserDTO userDTO = userService.getUserByEmail(email);

        // Log si utilisateur non trouvé
        if (userDTO == null) {
            logger.warn("Utilisateur non trouvé pour l'email: {}", email);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + email);
        }

        // Log pour afficher les détails de l'utilisateur récupéré
        logger.info("Utilisateur trouvé: {}", userDTO);

        return ResponseEntity.ok(userDTO);
    }

}
