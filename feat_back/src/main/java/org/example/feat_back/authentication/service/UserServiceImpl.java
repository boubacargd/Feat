package org.example.feat_back.authentication.service;

import org.example.feat_back.authentication.user.UserDTO;
import org.example.feat_back.authentication.user.UserEntity;
import org.example.feat_back.authentication.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO getUserByEmail(String email) {
        // Implémenter la logique pour récupérer l'utilisateur par email
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        if (userEntityOptional.isPresent()) {
            // Convertir UserEntity en UserDTO
            UserEntity userEntity = userEntityOptional.get();
            return new UserDTO(userEntity); // Utiliser le constructeur de UserDTO
        }
        return null; // Ou vous pouvez lancer une exception si l'utilisateur n'est pas trouvé
    }

    @Override
    public Optional<UserDTO> findById(Long id) {
        // Implémenter la logique pour récupérer l'utilisateur par ID
        Optional<UserEntity> userEntityOptional = userRepository.findById(id);
        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            return Optional.of(new UserDTO(userEntity)); // Retourner un UserDTO encapsulé dans un Optional
        }
        return Optional.empty(); // Si l'utilisateur n'est pas trouvé
    }

    @Override
    public void updateProfileImage(String email, String imagePath) {
        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);
        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            userEntity.setImageUrl(imagePath); // Mettre à jour le chemin de l'image
            userRepository.save(userEntity); // Enregistrer les changements
        } else {
            // Gérer le cas où l'utilisateur n'est pas trouvé (facultatif)
            System.out.println("User not found with email: " + email);
        }
    }
}
