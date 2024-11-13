import React, { useState } from 'react';
import LogoFeat from '@/components/logo';
import { SafeAreaView, View, TouchableOpacity, Text, Image, Alert, Dimensions} from 'react-native';
import i18n from '../../i18n';
import useStyles from '../../../styles/styleSheet';
import { useTheme } from '../../../hooks/useTheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Définir le type d'une image sélectionnée
type SelectedImage = {
    uri: string;
    fileName?: string;
    type?: string;
};

const { width } = Dimensions.get("window");
export default function AddImageProfile() {
    const styles = useStyles();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();
    const [image, setImage] = useState<SelectedImage | null>(null); // État d'image de type `SelectedImage` ou `null`
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>(); // Typage du paramètre `email`

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission d'accès à la galerie requise !");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            setImage({
                uri: selectedAsset.uri,
                fileName: selectedAsset.fileName ?? undefined,  // Utilisation de `undefined` au lieu de `null`
                type: selectedAsset.type
            });
        }
    };

    const uploadImage = async (selectedImage: SelectedImage) => {
        const token = await AsyncStorage.getItem('jwt_token');

        if (!selectedImage.uri) {
            Alert.alert("Erreur", "L'image sélectionnée n'est pas valide.");
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: selectedImage.uri,
            name: selectedImage.fileName || 'photo.jpg',
            type: selectedImage.type || 'image/jpeg',
        } as any);

        try {
            const response = await fetch('http://localhost:8080/api/images/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Image uploaded:', data);
            await updateProfileImage(email, data.imageUrl);
            router.push('/home');
        } catch (error) {
            const err = error as Error;
            console.error('Error uploading image:', err);
            Alert.alert("Erreur lors de l'upload de l'image.", err.message);
        }
    };

    const updateProfileImage = async (email: string, imageUrl: string) => {
        const token = await AsyncStorage.getItem('jwt_token');

        try {
            const response = await fetch('http://localhost:8080/api/public/user/updateProfileImage', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, imageUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.error || 'Failed to update profile image');
            }

            const data = await response.json();
            console.log('Profile image updated:', data.message);
        } catch (error) {
            const err = error as Error;
            console.error('Error updating profile image:', err);
            Alert.alert("Erreur lors de la mise à jour de l'image de profil.", err.message);
        }
    };

    const handleSkip = () => {
        router.push('/home');
    };

    const handleConfirm = async () => {
        if (image) {
            await uploadImage(image); // Confirmer et télécharger l'image
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <LogoFeat />

            <View style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "100%", height: "80%" }}>
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {!image && (
                        <>
                            <Ionicons name="image" size={80} style={[{}, themeTextStyle]} />
                            <Text style={[styles.textH1Bold, themeTextStyle]}>{i18n.t("infoUser.addimage")}</Text>
                        </>
                    )}
                    {image && <Image source={{ uri: image.uri }} style={{ width, height: 300,  marginVertical: 20 }} />}
                </View>

                <View style={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center" }}>
                    
                    {image && (
                        <TouchableOpacity
                            style={styles.buttonAddimg}
                            onPress={handleConfirm}>
                            <Text style={[styles.textH3Bold, themeButtonTextColor]}>Confirmer l'image</Text>
                        </TouchableOpacity>
                    )}
                    {/* Bouton pour choisir ou modifier l'image */}
                    <TouchableOpacity
                        style={[styles.button, themeBackgroundColorBtn]}
                        onPress={pickImage}>
                        <Text style={[styles.textH3Bold, themeButtonTextColor]}>
                            {image ? "Modifier l'image" : "Choisir une image"}
                        </Text>
                    </TouchableOpacity>

                    {/* Bouton pour confirmer l'image choisie */}


                    {/* Bouton pour sauter */}
                    <TouchableOpacity style={[styles.button]} onPress={handleSkip}>
                        <Text style={[styles.textH3Bold, themeTextStyle]}>Passer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
