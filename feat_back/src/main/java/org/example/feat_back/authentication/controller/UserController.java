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
        UserDTO userEntity = userService.getUserByEmail(email);

        // Vérification si l'utilisateur est trouvé
        if (userEntity == null) {
            // Retourner un message d'erreur plutôt qu'un objet null
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + email);
        }

        // Conversion de UserEntity en UserDTO
        UserDTO userDTO = new UserDTO(
                userEntity.getId(),
                userEntity.getFirstName(),
                userEntity.getLastName(),
                userEntity.getEmail(),
                null,  // Ne pas inclure le mot de passe pour des raisons de sécurité
                userEntity.getActivities(),
                userEntity.getCountry(),
                userEntity.getImageUrl()
        );

        // Retourner l'objet UserDTO
        return ResponseEntity.ok(userDTO);
    }
}
