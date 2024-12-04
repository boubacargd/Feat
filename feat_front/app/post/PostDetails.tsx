import React, { useState } from "react";
import { View, Text, Image, Modal, StyleSheet, Dimensions, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { PostModalOption } from "@/components/profile/post/PostModalOption"; // Importer le modal d'options
import Ionicons from '@expo/vector-icons/Ionicons';

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
    const [modalVisible, setModalVisible] = useState(false); // État pour le modal
    const [selectedPost, setSelectedPost] = useState(null); // Post sélectionné pour le modal

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

    const openModal = (post: any) => {
        setSelectedPost(post); // Stocker le post sélectionné
        setModalVisible(true); // Afficher le modal
    };

    const renderItem = ({ item, index }: { item: PostCardProps["posts"][0]; index: number }) => (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <Image source={{ uri: item.userImageUrl }} style={styles.userImage} />
                <Text style={styles.userName}>{item.userName}</Text>
                <TouchableOpacity onPress={() => openModal(item)} style={{position:"absolute", right:5}}>
                    <Ionicons name="ellipsis-horizontal" size={20} color="white" />
                </TouchableOpacity>
            </View>

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

            <View style={styles.iconsContainer}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => handleLike(index)} style={[styles.icon, { paddingRight: 20 }]}>
                        <AntDesign name={likedPosts[index] ? "heart" : "hearto"} size={20} color="white" style={{ paddingRight: 5 }} />
                        <Text style={{ color: "white" }}>290</Text>
                    </TouchableOpacity>

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

                <TouchableOpacity onPress={() => handleFavorite(index)} style={styles.icon}>
                    <AntDesign name={favoritedPosts[index] ? "tag" : "tago"} size={20} color="yellow" />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <Text style={{ fontSize: 12, fontWeight:800, color: "white", paddingRight: 5 }}>{item.userName}</Text>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <Modal visible={isVisible} animationType="slide" onRequestClose={toggleModal}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={toggleModal} style={{ justifyContent: "center", alignContent: "flex-end", left: 20 }}>
                        <AntDesign name="down" size={24} color="black" />
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={{ color: "black", fontWeight: "bold", fontSize:24 }}>{posts[0]?.userName}</Text>
                        <Text style={[styles.title, { color: "black" }]}>Post</Text>
                    </View>
                </View>

                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: "black" }}
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
        fontSize: 18,
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
        height: 400,

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