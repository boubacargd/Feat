package org.example.feat_back.authentication.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*") // Autoriser les requêtes depuis toutes les origines
public class ImageUploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Le fichier est vide."));
        }

        try {
            // Vérifiez que le dossier de téléchargement existe, sinon créez-le
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                boolean dirCreated = uploadDir.mkdirs();
                if (!dirCreated) {
                    return ResponseEntity.status(500).body(Collections.singletonMap("error", "Impossible de créer le répertoire de téléchargement."));
                }
            }

            // Génération d'un nom de fichier unique
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + File.separator + fileName;

            // Sauvegarder le fichier sur le serveur
            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path);

            // Construire l'URL complète pour accéder à l'image
            String imageUrl = BASE_URL + fileName;

            return ResponseEntity.ok(Collections.singletonMap("imageUrl", imageUrl));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erreur lors du téléchargement de l'image : " + e.getMessage()));
        }
    }

    // Méthode pour servir une image uploadée
    @GetMapping("/{fileName}")
    public ResponseEntity<?> getImage(@PathVariable String fileName) {
        try {
            // Construire le chemin complet de l'image
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(404).body(Collections.singletonMap("error", "Fichier non trouvé."));
            }

            // Déterminer le type MIME de l'image
            String mimeType = Files.probeContentType(filePath);

            // Retourner l'image en tant que réponse
            byte[] imageBytes = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(imageBytes);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Erreur lors de la récupération de l'image : " + e.getMessage()));
        }
    }
}
