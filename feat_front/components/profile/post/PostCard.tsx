import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type PostCardProps = {
    post: {
        id: number;
        userName: string;
        content: string;
        imageUrl: string[];
        userImageUrl: string;
        timeAgo?: string;
    };
};

export function PostCard({ post }: PostCardProps) {
    if (!post) {
        console.error("Erreur: Le post est vide ou non défini");
        return null; 
    }

    const randomImage = post.imageUrl[0]; 

    return (
        <View style={styles.postCard}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: randomImage }} style={styles.image} />
                <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} style={styles.gradient} />
                <View style={styles.overlayContent}>
                    <Text style={styles.postContent}>{post.content}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
    },
    imageContainer: {
        position: "relative",
        width: (width - 30) / 2,
        height: 200,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        borderRadius: 10,
    },
    overlayContent: {
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
    },
    postContent: {
        color: "white",
        fontSize: 16,
        fontWeight: "700",
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
});

export default PostCard;
