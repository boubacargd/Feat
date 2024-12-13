import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Fonction pour récupérer les commentaires d'un post
export const fetchComments = async (postId: number) => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.get(`http://localhost:8080/api/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires', error);
    throw error;
  }
};

// Fonction pour ajouter un commentaire à un post
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


// Fonction pour supprimer un commentaire
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
  