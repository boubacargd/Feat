//@service/posts.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Post {
    id: number;
    userName: string;
    userImageUrl: string;
    content: string;
    imageUrl: string[];
}

// Fonction pour récupérer tous les posts


export const fetchAllPosts = async (): Promise<Post[]> => {
    try {
        const token = await AsyncStorage.getItem('jwt_token');
        if (!token) {
            throw new Error("Token d'authentification manquant");
        }

        const response = await axios.get('http://localhost:8080/api/posts', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;  // Ceci retourne bien tous les posts triés.
    } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        return [];
    }
};


// Fonction pour récupérer les données des likes
export const fetchLikesData = async (postId: number) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
        console.error("Token d'authentification manquant");
        return { likeCounts: [], likedPosts: [] };
    }

    const likeCountArr: number[] = [];
    const likedPostArr: boolean[] = [];

    try {
        const likeCountResponse = await fetch(`http://localhost:8080/api/likes/count/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!likeCountResponse.ok) {
            console.error("Erreur HTTP:", likeCountResponse.status);
            return { likeCounts: [], likedPosts: [] };
        }

        const likeCountData = await likeCountResponse.json();
        likeCountArr.push(likeCountData || 0);

        const userId = await AsyncStorage.getItem('userId');
        const isLikedResponse = await fetch(`http://localhost:8080/api/likes/isLiked/${postId}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!isLikedResponse.ok) {
            console.error("Erreur HTTP:", isLikedResponse.status);
            return { likeCounts: [], likedPosts: [] };
        }

        const isLikedData = await isLikedResponse.json();
        likedPostArr.push(isLikedData || false);
    } catch (error) {
        console.error("Erreur lors de la récupération des données de like:", error);
    }

    return { likeCounts: likeCountArr, likedPosts: likedPostArr };
};

// Fonction pour gérer les likes (ajouter ou supprimer un like)
export const handleLike = async (
    index: number,
    postId: number,
    likedPosts: boolean[],
    setLikedPosts: React.Dispatch<React.SetStateAction<boolean[]>>,
    likeCounts: number[],
    setLikeCounts: React.Dispatch<React.SetStateAction<number[]>>
) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) return;

    try {
        const userId = await AsyncStorage.getItem('userId'); // Assurez-vous que l'ID utilisateur est récupéré

        // Envoyer une requête pour basculer le like
        const likeResponse = await fetch(`http://localhost:8080/api/likes/toggle/${postId}/${userId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!likeResponse.ok) return;

        // Rechargement des données de like
        const likeCountResponse = await fetch(`http://localhost:8080/api/likes/count/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const isLikedResponse = await fetch(`http://localhost:8080/api/likes/isLiked/${postId}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!likeCountResponse.ok || !isLikedResponse.ok) return;

        const likeCountData = await likeCountResponse.json();
        const isLikedData = await isLikedResponse.json();

        // Mise à jour des états des likes et des compteurs
        setLikeCounts((prev) => {
            const updated = [...prev];
            updated[index] = likeCountData || 0;
            return updated;
        });

        setLikedPosts((prev) => {
            const updated = [...prev];
            updated[index] = isLikedData || false;
            return updated;
        });
    } catch (error) {
        console.error("Erreur lors de la gestion du like:", error);
    }
};

// Fonction pour récupérer les utilisateurs qui ont liké un post
export const fetchUsersWhoLikedPost = async (postId: number): Promise<any[]> => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
        console.error("Token manquant");
        return [];
    }

    try {
        const response = await fetch(`http://localhost:8080/api/likes/users/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Erreur HTTP:", response.status);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs ayant liké:", error);
        return [];
    }
};
