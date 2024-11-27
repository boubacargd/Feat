import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import useStyles from "@/styles/styleSheet";
import { useTheme } from "@/hooks/useTheme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Post = {
    userName: string;
    timeAgo?: string;
    content: string;
    imageUrl: string; // Tableau pour plusieurs images
    userImageUrl: string;
    likes?: number;
    comments?: number;
};

export function UserPosts() {
    const styles = useStyles();
    const { themeTextStyle } = useTheme();
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem("jwt_token");
            if (!token) return;

            const response = await axios.get("http://localhost:8080/api/posts/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data); // Vérifiez les données ici
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la récupération des posts.");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!Array.isArray(posts)) {
        return <Text>Les posts n'ont pas pu être récupérés</Text>;
    }

    return (
        <View style={styles.containerPostList}>
            {posts.length > 0 ? (
                posts.map((post, index) => {
                    // Vérifiez si `images` contient des URLs ou s'il faut les construire
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
                                />
                            </View>

                            <Text style={styles.postContent}>{post.content}</Text>

                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={styles.postImages}
                            >
                                {post.imageUrl ?
                                    (<Image
                                        source={{ uri: post.imageUrl }}
                                        style={styles.postImage}
                                    />)
                                    :
                                    <>
                                    </>
                                }


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
        </View>
    );
}
