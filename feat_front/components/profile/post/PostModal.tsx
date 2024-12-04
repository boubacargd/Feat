import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useStyles from "@/styles/styleSheet";
import i18n from "@/app/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/hooks/useTheme";
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserPostButton } from "../UserPostButton";
import { router } from "expo-router";

type SelectedImage = {
    uri: string;
    fileName?: string;
    type?: string;
};
type ModalPostProps = {
    closeModal: () => void; // Définition de la prop closeModal
};

const { width } = Dimensions.get("window");

export function ModalPost({ closeModal }: ModalPostProps) {
    const { themeTextStyle, themeBackgroundColorBtn, themeButtonTextColor } = useTheme();
    const styles = useStyles();
    const [postDetail, setPostDetail] = useState(""); 
    const [images, setImages] = useState<SelectedImage[]>([]); 

    // Sélectionner plusieurs images
    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission d'accès à la galerie requise !");
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,  // Permet la sélection de plusieurs images
            quality: 1,
        });
    
        if (!result.canceled && result.assets.length > 0) {
            setImages(result.assets.map(asset => ({
                uri: asset.uri,
                fileName: asset.fileName ?? undefined,
                type: asset.type,
            })));
            console.log("Images sélectionnées:", result.assets);  // Log des images sélectionnées
        }
    };

    // Supprimer une image de la liste
    const removeImage = (uri: string) => {
        setImages(images.filter(image => image.uri !== uri));
        console.log("Image supprimée:", uri);  // Log de l'image supprimée
    };

    // Télécharger les images sélectionnées
    const uploadImages = async (selectedImages: SelectedImage[]): Promise<string[]> => {
        const token = await AsyncStorage.getItem("jwt_token");
        const imageUrls: string[] = [];
    
        for (const selectedImage of selectedImages) {
            const formData = new FormData();
            formData.append("file", {
                uri: selectedImage.uri,
                name: selectedImage.fileName || "photo.jpg",
                type: selectedImage.type || "image/jpeg",
            } as any);
    
            try {
                console.log(`Uploading image: ${selectedImage.uri}`);  // Log de l'image en cours d'upload
                const response = await fetch("http://localhost:8080/api/images/upload", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.text();
                    console.error("Error response:", errorData);
                    throw new Error("Erreur lors de l'upload de l'image.");
                }
    
                const data = await response.json();
                const imageUrl = data.imageUrl.startsWith("http") 
                    ? data.imageUrl 
                    : `http://localhost:8080/${data.imageUrl}`;
                imageUrls.push(imageUrl);
                console.log("Image uploadée avec succès:", imageUrl);  // Log de l'URL de l'image téléchargée
    
            } catch (error) {
                console.error("Error uploading image:", error);
                Alert.alert("Erreur lors de l'upload de l'image.");
                return [];
            }
        }
        console.log(`Total d'images téléchargées: ${imageUrls.length}`);  // Log du nombre d'images uploadées
        return imageUrls;
    };

    const handlePost = async () => {
        if (images.length === 0) {
            Alert.alert("Erreur", "Veuillez sélectionner au moins une image.");
            return;
        }
    
        const imageUrls = await uploadImages(images);
        if (imageUrls.length === 0) {
            Alert.alert("Erreur", "Les images n'ont pas pu être téléchargées.");
            return;
        }
    
        // Debug: Vérifie le contenu des URLs avant d'envoyer
        console.log("URLs des images à envoyer:", imageUrls);
    
        const createdPost = await createPost(postDetail, imageUrls);
        if (createdPost) {
            Alert.alert("Succès", "Votre post a été partagé !");
            setImages([]);
            setPostDetail("");
            closeModal();        
        }
    };
    

    const createPost = async (content: string, imageUrls: string[]) => {
        const token = await AsyncStorage.getItem("jwt_token");
    
        const postPayload = {
            content,
            imageUrl: imageUrls,  // Assure-toi que tu envoies bien un tableau d'URLs
        };
    
        // Debug : Vérifie ce que tu envoies dans la requête
        console.log("Corps de la requête postPayload:", postPayload);
    
        try {
            const response = await fetch("http://localhost:8080/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postPayload),
            });
    
            if (!response.ok) {
                const errorData = await response.text();
                console.error("Error response:", errorData);
                throw new Error("Erreur serveur.");
            }
    
            const data = await response.json();
            console.log("Post créé:", data);
            return data;
        } catch (error) {
            console.error("Error creating post:", error);
            Alert.alert("Erreur lors de la création du post.");
            return null;
        }
    };
    
    

    return (
        <View>
            <View
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: "100%",
                    height: "70%",
                }}
            >
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
               

                    <FlatList
                        data={images}
                        horizontal
                        renderItem={({ item, index }) => (
                            <View style={{ alignItems: "center" }}>
                                <Image 
                                    key={item.uri + index}
                                    source={{ uri: item.uri }} 
                                    style={{ width, height: 500, marginRight:10, marginBottom:10 }} 
                                />
                                <TouchableOpacity onPress={() => removeImage(item.uri)} style={{ marginTop: 10 }}>
                                    <Text style={[styles.textH3Bold, themeTextStyle]}>
                                        {i18n.t("infoUser.removeImg")}jj
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => item.uri + index}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <TouchableOpacity style={[styles.buttonShare, themeBackgroundColorBtn]} onPress={pickImages}>
                        <Ionicons name="images" size={24} style={[themeButtonTextColor]}/>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder={i18n.t("post.description")}
                    placeholderTextColor="#6a6a6a"
                    value={postDetail}
                    onChangeText={setPostDetail}
                    style={styles.desInput}
                />

                <TouchableOpacity style={styles.buttonShare} onPress={handlePost}>
                    <Text style={[styles.textH3Bold, themeButtonTextColor]}>
                        Parager!
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
