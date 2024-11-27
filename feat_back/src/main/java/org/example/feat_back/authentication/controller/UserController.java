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

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestParam String email) {
        // Récupérer l'utilisateur par email
        UserDTO userDTO = userService.getUserByEmail(email);

        // Vérification si l'utilisateur est trouvé
        if (userDTO == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + email);
        }

        // Retourner l'objet UserDTO complet avec toutes les informations
        return ResponseEntity.ok(userDTO);
    }

}
