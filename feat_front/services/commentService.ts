import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await axios.get(`http://localhost:8080/api/comments/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const comments: Comment[] = response.data?.data || [];
    console.log("Réponse brute de l'API pour les commentaires:", response.data);
    
    // Récupération des IDs d'utilisateur
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

    return comments;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return [];
  }
};




export const fetchMultipleUserDetails = async (userIds: number[]) => {
  if (!userIds || userIds.length === 0) {
    console.error("Aucun userId fourni pour récupérer les détails des utilisateurs.");
    return {};  // Retourne un objet vide si aucun `userId`
  }

  try {
    const token = await AsyncStorage.getItem('jwt_token');  // Récupère le token ici
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    console.log("Fetching user details for userIds:", userIds);

    // Appel à l'API pour récupérer les détails des utilisateurs par ID
    const response = await axios.get(`http://localhost:8080/api/user/profileById`, {
      params: { id: userIds.join(',') },  // Envoie les IDs des utilisateurs sous forme de paramètre
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Détails des utilisateurs récupérés:", response.data);

    // Organise les détails des utilisateurs par `userId`
    const userDetailsMap: { [userId: number]: any } = {};

    response.data.forEach((user: any) => {
      userDetailsMap[user.id] = user;  // Stocke les infos utilisateur par `userId`
    });

    return userDetailsMap;
  } catch (error) {
    console.error("Erreur lors de la récupération des informations des utilisateurs:", error);
    return {};  // Retourne un objet vide en cas d'erreur
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
