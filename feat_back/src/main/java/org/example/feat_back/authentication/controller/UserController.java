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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfileByEmail(@RequestParam String email) {
        logger.debug("Email reçu pour récupérer les détails de l'utilisateur: {}", email);

        // Récupérer l'utilisateur par email
        UserDTO userDTO = userService.getUserByEmail(email);

        if (userDTO == null) {
            logger.warn("Utilisateur non trouvé pour l'email: {}", email);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + email);
        }

        logger.info("Utilisateur trouvé: {}", userDTO);
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/profileById")
    public ResponseEntity<?> getUserProfileById(@RequestParam String id) {
        try {
            // Convertir l'ID en Long (un ou plusieurs IDs séparés par des virgules)
            String[] ids = id.split(",");
            List<Long> userIds = Arrays.stream(ids)
                    .map(Long::parseLong)
                    .collect(Collectors.toList());

            // Récupérer les utilisateurs par IDs
            List<UserDTO> userDTOs = userService.getUsersByIds(userIds);

            if (userDTOs.isEmpty()) {
                logger.warn("Aucun utilisateur trouvé pour les IDs: {}", id);
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("No users found for IDs: " + id);
            }

            logger.info("Utilisateurs trouvés pour les IDs: {}", userDTOs);
            return ResponseEntity.ok(userDTOs);

        } catch (NumberFormatException e) {
            logger.error("IDs invalides: {}", id, e);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid user ID format.");
        }
    }
}
