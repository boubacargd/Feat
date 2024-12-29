package org.example.feat_back.authentication.service;

import org.example.feat_back.authentication.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    private final String GOOGLE_API_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=";

    @Override
    public UserDTO getUserByEmail(String email) {
        // Récupérer l'utilisateur par email, sans encapsuler dans un Optional supplémentaire
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            String name = "";

            // Choisir le nom complet en fonction de l'authentification
            if (userEntity.getAuthProvider() == AuthProvider.GOOGLE) {
                name = userEntity.getName();  // Nom complet pour un utilisateur Google
            } else {
                name = userEntity.getFirstName() + " " + userEntity.getLastName();  // Nom complet pour un utilisateur local
            }

            // Retourner un UserDTO sans mot de passe
            return new UserDTO(userEntity.getId(), userEntity.getFirstName(), userEntity.getLastName(),
                    userEntity.getEmail(), userEntity.getActivities(),
                    userEntity.getCountry(), userEntity.getImageUrl(), name);

        }
        return null;  // Si utilisateur non trouvé
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<UserEntity> userEntityOptional = userRepository.findById(id);
        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            return new UserDTO(userEntity);  // Retourne un UserDTO
        }
        return null;  // Retourne null si l'utilisateur n'est pas trouvé
    }

    @Override
    public List<UserDTO> getUsersByIds(List<Long> userIds) {
        List<UserEntity> userEntities = userRepository.findAllById(userIds);
        return userEntities.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserName(String email){
        return userRepository.findUserNameByEmail(email);
    }

    @Override
    public void updateProfileImage(String email, String imagePath) {
        // Correction : Pas besoin de Optional supplémentaire
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            userEntity.setImageUrl(imagePath); // Mettre à jour le chemin de l'image
            userRepository.save(userEntity); // Enregistrer les changements
        } else {
            // Gérer le cas où l'utilisateur n'est pas trouvé
            System.out.println("User not found with email: " + email);
        }
    }

    @Override
    public UserEntity createUserFromGoogleToken(GoogleUserInfo userInfo) {
        // Vérification de l'existence de l'utilisateur par email
        Optional<UserEntity> existingUser = userRepository.findByEmail(userInfo.getEmail());

        // Si l'utilisateur existe déjà, retourner cet utilisateur
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // Sinon, créer un nouvel utilisateur
        UserEntity newUser = new UserEntity();
        newUser.setEmail(userInfo.getEmail());
        newUser.setGoogleId(userInfo.getUserId());  // Définir l'ID de l'utilisateur Google
        newUser.setName(userInfo.getName());  // Définir le nom de l'utilisateur
        newUser.setProfileImage(userInfo.getPicture());  // Définir l'URL de la photo de l'utilisateur

        // Ajouter d'autres informations par défaut si nécessaire

        // Enregistrer l'utilisateur dans la base de données
        UserEntity savedUser = userRepository.save(newUser);

        return savedUser; // Retourner l'utilisateur créé
    }

    private String getGoogleUserInfo(String accessToken) {
        // Appel à l'API Google pour récupérer les informations de l'utilisateur
        try {
            URL url = new URL(GOOGLE_API_URL + accessToken);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            return response.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve user info from Google: " + e.getMessage());
        }
    }
}
