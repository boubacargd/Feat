import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity, View, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { fetchAllPosts, fetchLikesData, handleLike, Post } from '@/services/posts';

const { width } = Dimensions.get('window');

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [likeCounts, setLikeCounts] = useState<number[]>([]);
    const [likedPosts, setLikedPosts] = useState<boolean[]>([]);
    const [currentIndexes, setCurrentIndexes] = useState<number[]>([]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const postsData = await fetchAllPosts();
                setPosts(postsData);

                setLikeCounts(new Array(postsData.length).fill(0));
                setLikedPosts(new Array(postsData.length).fill(false));
                setCurrentIndexes(new Array(postsData.length).fill(0));

                postsData.forEach((post) => {
                    fetchLikesData(post.id);
                });
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des posts", error);
            }
        };

        loadPosts();
    }, []);

    const handleScroll = (index: number, contentOffsetX: number) => {
        const newIndexes = [...currentIndexes];
        const newIndex = Math.floor(contentOffsetX / width);
        newIndexes[index] = newIndex;
        setCurrentIndexes(newIndexes);
    };

    const renderItem = ({ item, index }: { item: Post; index: number }) => (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <Image source={{ uri: item.userImageUrl }} style={styles.userImage} />
                <Text style={styles.userName}>{item.userName}</Text>
            </View>

            <FlatList
                data={item.imageUrl}
                horizontal
                keyExtractor={(url) => url}
                renderItem={({ item: image }) => <Image source={{ uri: image }} style={styles.mainImage} />}
                onScroll={({ nativeEvent }) => handleScroll(index, nativeEvent.contentOffset.x)}
                showsHorizontalScrollIndicator={false}
            />

            <View style={styles.iconsContainer}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => handleLike(index, item.id, likedPosts, setLikedPosts, likeCounts, setLikeCounts)}>
                        <AntDesign
                            name={likedPosts[index] ? "heart" : "hearto"}
                            size={20}
                            color={likedPosts[index] ? "red" : "white"}
                            style={{ marginRight: 5 }}
                        />
                    </TouchableOpacity>
                    <Text style={{ color: "white" }}>{likeCounts[index]}</Text>

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
            </View>

            <View style={styles.contentContainer}>
                <Text style={{ fontWeight: "bold", color: "white" }}>{item.userName}</Text>
                <Text style={{ color: "white" }}>{item.content}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="white" style={{ margin: "auto" }} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#1c1c1c',
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    mainImage: {
        width: width,
        height: 250,
        marginBottom: 10,
    },
    iconsContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    icon: {
        marginRight: 15,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: 'red',
    },
    contentContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    contentText: {
        color: 'white',
        fontSize: 14,
    },
});
