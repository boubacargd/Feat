import React, { useState } from "react";
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router"; // Utiliser le hook `useRouter`
import { LinearGradient } from "expo-linear-gradient";
import PostDetails from "@/app/post/PostDetails"; // Assurez-vous d'importer le composant PostDetails

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

type PostListProps = {
    posts: PostCardProps["post"][];
};

export function PostList({ posts }: PostListProps) {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handlePress = () => {
        toggleModal();
    };

    return (
        <View>
            <ScrollView horizontal>
                <FlatList
                    data={posts}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={handlePress} style={styles.postCard}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
                                <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} style={styles.gradient} />
                                <View style={styles.overlayContent}>
                                    <Text style={styles.postContent}>{item.content}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.flatListContainer}
                />
            </ScrollView>

            {/* Affichage de la modale avec tous les posts */}
            <PostDetails
                posts={posts}
                isVisible={isModalVisible}
                toggleModal={toggleModal}
            />
        </View>
    );
}



const styles = StyleSheet.create({
    postCard: {
        flex: 1,
        margin: "auto",
        borderRadius: 10,
        padding: 10,
    },
    flatListContainer: {
        paddingBottom: 20,
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
