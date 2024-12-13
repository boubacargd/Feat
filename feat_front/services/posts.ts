//@service/posts.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

export interface Post {
    id: number;
    userName: string;
    userImageUrl: string;
    content: string;
    imageUrl: string[];
}

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




export const fetchLikesData = async (postId: number) => {
    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
        console.error("Token d'authentification manquant");
        return { likeCounts: [], likedPosts: [] };
    }

    try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken?.userId || await AsyncStorage.getItem('userId');

        if (!userId || isNaN(Number(userId))) {
            throw new Error("ID utilisateur invalide ou manquant");
        }

        // Récupérer le nombre de likes
        const [likeCountResponse, isLikedResponse] = await Promise.all([
            fetch(`http://localhost:8080/api/likes/count/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://localhost:8080/api/likes/isLiked/${postId}/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ]);

        if (!likeCountResponse.ok || !isLikedResponse.ok) {
            throw new Error(`Erreur HTTP: ${likeCountResponse.status}, ${isLikedResponse.status}`);
        }

        const likeCountData = await likeCountResponse.json();
        const isLikedData = await isLikedResponse.json();

        return { likeCounts: [likeCountData || 0], likedPosts: [isLikedData || false] };
    } catch (error) {
        console.error("Erreur lors de la récupération des données de like:", error);
        return { likeCounts: [], likedPosts: [] };
    }
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
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken?.userId || await AsyncStorage.getItem('userId');

        if (!userId) throw new Error("ID utilisateur manquant");

        console.log(`Toggle like for post ${postId} by user ${userId}`);

        const response = await fetch(`http://localhost:8080/api/likes/toggle/${postId}/${userId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        // Recharger les données de like uniquement pour ce post
        const { likeCounts, likedPosts } = await fetchLikesData(postId);

        // Mettre à jour les états locaux
        setLikeCounts((prev) => {
            const updated = [...prev];
            updated[index] = likeCounts[0] || 0;
            return updated;
        });

        setLikedPosts((prev) => {
            const updated = [...prev];
            updated[index] = likedPosts[0] || false;
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

export const fetchAllPostsWithLikes = async (): Promise<{ posts: Post[], likeCounts: number[] }> => {
    try {
        const token = await AsyncStorage.getItem('jwt_token');
        if (!token) throw new Error("Token d'authentification manquant");

        const response = await axios.get('http://localhost:8080/api/posts', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const posts: Post[] = response.data;

        // Récupérer les likes pour chaque post
        const likeCountsPromises = posts.map(post =>
            fetch(`http://localhost:8080/api/likes/count/${post.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => (res.ok ? res.json() : 0))
        );

        const likeCounts = await Promise.all(likeCountsPromises);

        return { posts, likeCounts };
    } catch (error) {
        console.error("Erreur lors de la récupération des posts avec likes:", error);
        return { posts: [], likeCounts: [] };
    }
};
