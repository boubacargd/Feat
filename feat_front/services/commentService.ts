import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchComments = async (postId: number) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.get(`http://localhost:8080/api/comments/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return [];
  }
};

export const fetchUserDetails = async (email: string) => {
  try {
    console.log("Fetching user details for email:", email);  // Ajoute un log ici pour vérifier l'email

    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    // Récupérer les informations de l'utilisateur à partir de son email
    const response = await axios.get(`http://localhost:8080/api/user/profile?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Détails de l'utilisateur récupérés:", response.data);
    return response.data || {};  // Utilisateur avec nom et image de profil
  } catch (error) {
    console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
    return {};
  }
};


export const addComment = async (postId: number, content: string, userId: number, userName: string) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.post(
      `http://localhost:8080/api/comments/${postId}`,
      {
        content,
        userId,
        userName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire", error);
    throw error;
  }
};


export const deleteComment = async (commentId: number) => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        throw new Error("Token d'authentification manquant");
      }
  
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire", error);
      throw error;
    }
  };
  