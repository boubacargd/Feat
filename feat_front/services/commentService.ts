import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  userName?: string; // Facultatif si non toujours fourni
  content: string;
  createdAt: string;
};

// Récupère les commentaires d'un post spécifique
export const fetchComments = async (postId: number): Promise<Comment[]> => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    // Appel à l'API pour récupérer les commentaires d'un post
    const response = await axios.get(`http://localhost:8080/api/comments/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const comments: Comment[] = response.data;

    // Récupère les IDs d'utilisateur uniques
    const userIds = [...new Set(comments.map((comment) => comment.userId))];

    if (userIds.length > 0) {
      const userDetails = await fetchMultipleUserDetails(userIds);

      // Enrichir les commentaires avec les noms d'utilisateur
      return comments.map((comment) => {
        const user = userDetails[comment.userId];
        return {
          ...comment,
          userName: user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu',
        };
      });
    }

    return comments; // Retourne les commentaires sans enrichissement si pas d'utilisateur
  } catch (error) {
    console.error("(fetchComments)Erreur lors de la récupération des commentaires:", error);
    return [];
  }
};

// Récupère les détails des utilisateurs
export const fetchMultipleUserDetails = async (userIds: number[]): Promise<{ [userId: number]: any }> => {
  if (!userIds || userIds.length === 0) {
    console.error("Aucun userId fourni pour récupérer les détails des utilisateurs.");
    return {};
  }

  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    console.log("Requête envoyée avec IDs :", userIds.join(','));
    const response = await axios.get(`http://localhost:8080/api/user/profileById`, {
      params: { id: userIds.join(',') },
      headers: { Authorization: `Bearer ${token}` },
    });
    

    // Organise les détails des utilisateurs par ID
    const userDetailsMap: { [userId: number]: any } = {};
    response.data.forEach((user: any) => {
      userDetailsMap[user.id] = user;
    });

    return userDetailsMap;
  } catch (error) {
    console.error("(fetchMultipleUserDetails) Erreur lors de la récupération des informations des utilisateurs:", error);
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
