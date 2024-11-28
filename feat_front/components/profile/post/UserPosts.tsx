import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import useStyles from "@/styles/styleSheet";
import { useTheme } from "@/hooks/useTheme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Post = {
    id: number;
    userName: string;
    timeAgo?: string;
    content: string;
    imageUrl: string[]; // Tableau pour plusieurs images
    userImageUrl: string;
    likes?: number;
    comments?: number;
};

export function UserPosts() {
    const styles = useStyles();
    const { themeTextStyle } = useTheme();
    const [posts, setPosts] = useState<Post[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false); // State pour contrôler le modal
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Pour savoir quel post est sélectionné

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem("jwt_token");
            if (!token) return;

            const response = await axios.get("http://localhost:8080/api/posts/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data); // Vérifie les données
            setPosts(response.data.map((post: Post) => ({
                ...post,
                imageUrl: Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl]
            })));
        } catch (error) {
            console.error("Error fetching posts:", error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des posts.");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleOptionClick = (post: Post) => {
        setSelectedPost(post);
        setModalVisible(true); // Ouvre le modal
    };

    const handleDeletePost = async () => {
        if (selectedPost) {
            try {
                const token = await AsyncStorage.getItem("jwt_token");
                if (!token) return;

                // Appel à l'API pour supprimer le post
                await axios.delete(`http://localhost:8080/api/posts/${selectedPost.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Supprime le post côté frontend
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== selectedPost.id)
                );

                Alert.alert("Succès", "Le post a été supprimé avec succès.");
            } catch (error) {
                console.error("Erreur lors de la suppression du post :", error);
                Alert.alert("Erreur", "Impossible de supprimer le post.");
            } finally {
                setModalVisible(false); // Ferme le modal
            }
        }
    };


    const handleEditDescription = () => {
        if (selectedPost) {
            // Logique pour modifier la description ici
            console.log(`Modifier la description du post: ${selectedPost.userName}`);
        }
        setModalVisible(false);
    };

    const handleSharePost = () => {
        if (selectedPost) {
            // Logique pour partager le post ici
            console.log(`Partager le post: ${selectedPost.userName}`);
        }
        setModalVisible(false);
    };

    return (
        <View style={styles.containerPostList}>
            {posts.length > 0 ? (
                posts.map((post: Post, index) => {
                    const postImages = post.imageUrl || [];

                    return (
                        <View key={index} style={styles.postCard}>
                            <View style={styles.userInfoPost}>
                                <Image
                                    source={{ uri: post.userImageUrl }}
                                    style={styles.userImage}
                                />
                                <View>
                                    <Text style={styles.userName}>{post.userName}</Text>
                                    <Text style={styles.postTime}>{post.timeAgo}</Text>
                                </View>
                                <Ionicons
                                    name="ellipsis-horizontal"
                                    size={24}
                                    color="#6a6a6a"
                                    style={[styles.moreIcon, themeTextStyle]}
                                    onPress={() => handleOptionClick(post)} // Affiche le modal
                                />
                            </View>

                            <Text style={styles.postContent}>{post.content}</Text>

                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={styles.postImages}
                            >
                                {post.imageUrl && Array.isArray(post.imageUrl) ? (
                                    post.imageUrl.map((imageUri, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: imageUri }}
                                            style={{ width: 200, height: 200, marginRight: 10 }}
                                        />
                                    ))
                                ) : null}
                            </ScrollView>

                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <FontAwesome name="heart-o" size={20} color="#333" style={styles.iconPost} />
                                    <Text style={styles.statsText}>{post.likes || 0}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <FontAwesome name="comment-o" size={20} color="#333" style={styles.iconPost} />
                                    <Text style={styles.statsText}>{post.comments || 0}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                })
            ) : (
                <Text>Aucun post encore.</Text>
            )}

            {/* Modal Options */}
            {modalVisible && selectedPost && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalBackdrop}></View>
                    </TouchableWithoutFeedback>

                    <View style={styles.modalContainerPost}>
                        <TouchableOpacity onPress={handleEditDescription}>
                            <Text style={styles.modalOption}>Modifier Description</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSharePost}>
                            <Text style={styles.modalOption}>Partager</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeletePost}>
                            <Text style={[styles.modalOption, { color: 'red' }]}>Éliminer</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

            )}
        </View>
    );
}
