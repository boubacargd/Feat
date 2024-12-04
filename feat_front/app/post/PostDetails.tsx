import React, { useState } from "react";
import { View, Text, Image, Modal, StyleSheet, Dimensions, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

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
    const [likedPosts, setLikedPosts] = useState<boolean[]>(new Array(posts.length).fill(false)); // Gérer les likes
    const [favoritedPosts, setFavoritedPosts] = useState<boolean[]>(new Array(posts.length).fill(false)); // Gérer les favoris

    const handleScroll = (index: number, contentOffsetX: number) => {
        const newIndexes = [...currentIndexes];
        const newIndex = Math.floor(contentOffsetX / width);
        newIndexes[index] = newIndex;
        setCurrentIndexes(newIndexes);
    };

    const handleLike = (index: number) => {
        const newLikes = [...likedPosts];
        newLikes[index] = !newLikes[index]; // Inverser l'état du like
        setLikedPosts(newLikes);
    };

    const handleFavorite = (index: number) => {
        const newFavorites = [...favoritedPosts];
        newFavorites[index] = !newFavorites[index]; // Inverser l'état du favori
        setFavoritedPosts(newFavorites);
    };

    const renderItem = ({ item, index }: { item: PostCardProps["posts"][0]; index: number }) => (
            <View style={styles.postContainer}>
                {/* En-tête du post */}
                <View style={styles.header}>
                    <Image source={{ uri: item.userImageUrl }} style={styles.userImage} />
                    <Text style={styles.userName}>{item.userName}</Text>
                </View>

                {/* Carrousel d'images */}
                <FlatList
                    data={item.imageUrl}
                    horizontal
                    keyExtractor={(url) => url}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item }} style={styles.mainImage} />
                    )}
                    onScroll={({ nativeEvent }) => {
                        handleScroll(index, nativeEvent.contentOffset.x);
                    }}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Points de navigation */}


                {/* Icônes en bas */}
                <View style={styles.iconsContainer}>

                    <View style={{ display: "flex", flexDirection: "row", }}>
                        <TouchableOpacity onPress={() => handleLike(index)} style={[styles.icon, { paddingRight: 20, }]}>
                            <AntDesign name={likedPosts[index] ? "heart" : "hearto"} size={20} color="white" style={{ paddingRight: 5 }} />
                            <Text style={{ color: "white" }}>290</Text>
                        </TouchableOpacity>

                        {/* Icône "Commentaire" */}
                        <TouchableOpacity style={styles.icon}>
                            <AntDesign name="message1" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pagination}>
                        {item.imageUrl.map((_, imageIndex) => (
                            <View
                                key={imageIndex}
                                style={[
                                    styles.paginationDot,
                                    currentIndexes[index] === imageIndex && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>

                    {/* Icône "Favori" */}
                    <TouchableOpacity onPress={() => handleFavorite(index)} style={styles.icon}>
                        <AntDesign name={favoritedPosts[index] ? "tag" : "tago"} size={20} color="yellow" />
                    </TouchableOpacity>
                </View>

                {/* Contenu du post */}
                <View style={styles.contentContainer}>
                    <Text style={{ fontSize: 12, fontWeight: "800", color: "white", paddingRight: 5 }}>{item.userName}</Text>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
            </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <Modal visible={isVisible} animationType="slide" onRequestClose={toggleModal}>
                {/* En-tête de la modale */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={toggleModal}>
                        <AntDesign name="down" size={28} color="white" />
                    </TouchableOpacity>

                    {/* Nom d'utilisateur et titre */}
                    <View style={styles.headerCenter}>
                        <Text style={styles.userName}>{posts[0]?.userName}</Text> {/* Ici, on affiche le userName du premier post */}
                        <Text style={styles.title}>Post</Text>
                    </View>
                </View>

                {/* Liste des posts */}
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: "black" }}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "black",
        marginBottom: 50,
        borderRadius: 10,
        overflow: "hidden"
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
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    title: {
        fontSize: 14,
        color: "white",
    },
    mainImage: {
        width,
        height: 300,

    },
    contentContainer: {
        padding: 10,

        flexDirection: "row"
    },
    content: {
        fontSize: 14,
        color: "white",
    },
    modalHeader: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: "black",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.2,
        borderBottomColor: "white"
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
        right: 15
    },
    flatListContent: {
        padding: 10,
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
