import React, { useState, useEffect } from "react";
import { View, Text, Image, Modal, StyleSheet, Dimensions, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PostModalOption } from "@/components/profile/post/PostModalOption";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");

type PostCardProps = {
    posts: {
        id: number;
        userName: string;
        content: string;
        imageUrl: string[];
        userImageUrl: string;
    }[];
    isVisible: boolean;
    toggleModal: () => void;
};

export default function PostDetails({ posts, isVisible, toggleModal }: PostCardProps) {
    const [currentIndexes, setCurrentIndexes] = useState<number[]>(new Array(posts.length).fill(0));
    const [likedPosts, setLikedPosts] = useState<boolean[]>(new Array(posts.length).fill(false));
    const [favoritedPosts, setFavoritedPosts] = useState<boolean[]>(new Array(posts.length).fill(false));
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [likeCounts, setLikeCounts] = useState<number[]>(new Array(posts.length).fill(0));
    const [usersWhoLiked, setUsersWhoLiked] = useState<any[][]>(new Array(posts.length).fill([]));

    const fetchLikesData = async (postId: number, index: number) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');
            if (!token) {
                throw new Error("Token d'authentification manquant");
            }
    
            const likeCountResponse = await fetch(`http://localhost:8080/api/likes/count/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            const isLikedResponse = await fetch(`http://localhost:8080/api/likes/isLiked/${postId}/123`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!likeCountResponse.ok || !isLikedResponse.ok) {
                throw new Error("Erreur lors de la récupération des données de like");
            }
    
            const likeCountData = await likeCountResponse.json();
            const isLikedData = await isLikedResponse.json();
    
            setLikeCounts(prev => {
                const updated = [...prev];
                updated[index] = likeCountData || 0;
                return updated;
            });
    
            setLikedPosts(prev => {
                const updated = [...prev];
                updated[index] = isLikedData || false;
                return updated;
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données de like:", error);
        }
    };
    

    useEffect(() => {
        posts.forEach((post, index) => {
            fetchLikesData(post.id, index); // Récupérer les données pour chaque post
        });
    }, [posts]);

    const handleScroll = (index: number, contentOffsetX: number) => {
        const newIndexes = [...currentIndexes];
        const newIndex = Math.floor(contentOffsetX / width);
        newIndexes[index] = newIndex;
        setCurrentIndexes(newIndexes);
    };

    const handleLike = async (index: number, postId: number) => {
        const newLikes = [...likedPosts];
        const newLikeStatus = !newLikes[index];
        newLikes[index] = newLikeStatus; // Inverser l'état du like
    
        // Mise à jour locale du like
        setLikedPosts(newLikes);
    
        // Récupérer le token JWT depuis AsyncStorage
        const token = await AsyncStorage.getItem('jwt_token');
        if (!token) {
            console.error('Token manquant');
            return;
        }
    
        // Inclure userId dans l'URL
        const userId = 123; // Remplacez par l'ID de l'utilisateur authentifié
        try {
            const response = await fetch(`http://localhost:8080/api/likes/toggle/${postId}/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log('Le like a été mis à jour avec succès.');
                fetchLikesData(postId, index);
            } else {
                console.error('Erreur HTTP lors du changement de like:', response.status);
                const errorMessage = await response.text();
                console.error('Message d\'erreur du serveur:', errorMessage);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du like:', error);
        }
    };
    

    const handleFavorite = (index: number) => {
        const newFavorites = [...favoritedPosts];
        newFavorites[index] = !newFavorites[index]; // Inverser l'état du favori
        setFavoritedPosts(newFavorites);
    };

    const openModal = (post: any) => {
        setSelectedPost(post);
        setModalVisible(true);
    };

    const renderItem = ({ item, index }: { item: PostCardProps["posts"][0]; index: number }) => (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <Image source={{ uri: item.userImageUrl }} style={styles.userImage} />
                <Text style={styles.userName}>{item.userName}</Text>
                <TouchableOpacity onPress={() => openModal(item)} style={{ position: "absolute", right: 5 }}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={item.imageUrl}
                horizontal
                keyExtractor={(url) => url}
                renderItem={({ item }) => <Image source={{ uri: item }} style={styles.mainImage} />}
                onScroll={({ nativeEvent }) => handleScroll(index, nativeEvent.contentOffset.x)}
                showsHorizontalScrollIndicator={false}
            />

            <View style={styles.iconsContainer}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => handleLike(index, item.id)} style={[styles.icon, { paddingRight: 20 }]}>
                        <AntDesign name={likedPosts[index] ? "heart" : "hearto"} size={20} color="white" style={{ paddingRight: 5 }} />
                        <Text style={{ color: "white" }}>{likeCounts[index]} </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.icon}>
                        <AntDesign name="message1" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.pagination}>
                    {item.imageUrl.map((_, imageIndex) => (
                        <View key={imageIndex} style={[styles.paginationDot, currentIndexes[index] === imageIndex && styles.activeDot]} />
                    ))}
                </View>

                <TouchableOpacity onPress={() => handleFavorite(index)} style={styles.icon}>
                    <AntDesign name={favoritedPosts[index] ? "tag" : "tago"} size={20} color="yellow" />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <Text style={{ fontSize: 12, fontWeight: "800", color: "white", paddingRight: 5 }}>{item.userName}</Text>
                <Text style={styles.content}>{item.content}</Text>
            </View>
        </View>
    );

    const handleEditDescription = () => {
        console.log("Modifier description pour :", selectedPost);
        setModalVisible(false);
    };

    const handleSharePost = () => {
        console.log("Partager post :", selectedPost);
        setModalVisible(false);
    };

    const handleDeletePost = () => {
        console.log("Supprimer post :", selectedPost);
        setModalVisible(false);
    };

    return (
        <SafeAreaView>
            <Modal visible={isVisible} animationType="slide" onRequestClose={toggleModal}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={toggleModal} style={{ justifyContent: "center", alignContent: "flex-end", left: 18 }}>
                        <AntDesign name="down" size={24} color="black" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={{ color: "black", fontWeight: "bold", fontSize: 20 }}>{posts[0]?.userName}</Text>
                        <Text style={[styles.title, { color: "black" }]}>Post</Text>
                    </View>
                </View>

                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.flatListStyle}
                />

                <PostModalOption
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    selectedPost={selectedPost}
                    handleEditDescription={handleEditDescription}
                    handleSharePost={handleSharePost}
                    handleDeletePost={handleDeletePost}
                />
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 50,
        width: width, 
        padding: 0, 
        marginLeft: 0, 
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "black",
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    title: {
        fontSize: 14,
        color: "white",
    },
    mainImage: {
        width: width,
        height: 300,
        resizeMode: "cover",
        margin: 0, 
        padding: 0, 
    },
    contentContainer: {
        padding: 10,
        flexDirection: "row",
    },
    content: {
        fontSize: 14,
        color: "white",
    },
    modalHeader: {
        padding: 10,
        paddingTop: 60,
        backgroundColor: "white",
        flexDirection: "row",
        borderWidth: 0.2,
        borderBottomColor: "white",
        display: "flex",
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
        right: 15,
    },
    flatListContent: {
        padding: 0, 
    },
    flatListStyle: {
        width: width, 
        backgroundColor: "black",
    },
    pagination: {
        right: 38,
        flexDirection: "row",
    },
    paginationDot: {
        width: 5,
        height: 5,
        margin: 3,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    activeDot: {
        backgroundColor: "red",
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        top: 5,
    },
    icon: {
        flexDirection: "row",
        alignItems: "center",
    },
});
