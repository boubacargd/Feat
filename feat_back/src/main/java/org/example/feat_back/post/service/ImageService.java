package org.example.feat_back.post.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageService {

    private final String uploadDir = "uploads"; // Dossier où stocker les fichiers

    public String saveImage(MultipartFile file) throws IOException {
        // Vérifiez que le dossier existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Sauvegarder le fichier
        String fileName = file.getOriginalFilename();
        System.out.println("Nom de fichier reçu : " + fileName);
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        // Retourner le chemin relatif pour l'URL
        String fileUrl = "/uploads/" + fileName;
        System.out.println("Image sauvegardée à : " + fileUrl);
        return fileUrl;
    }

}
