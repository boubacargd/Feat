package org.example.feat_back.authentication.controller;

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
@CrossOrigin(origins = "*")
public class ImageUploadController {
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Le fichier est vide."));
        }

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String filePath = UPLOAD_DIR + "/" + fileName;
            Path path = Paths.get(filePath);
            Files.copy(file.getInputStream(), path);

            // Retourne un chemin relatif pour l'image
            return ResponseEntity.ok().body(Collections.singletonMap("imageUrl", fileName));

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Failed to upload image: " + e.getMessage()));
        }
    }
}
