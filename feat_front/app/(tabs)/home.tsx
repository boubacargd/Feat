import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity, View, Image, Dimensions, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { fetchAllPosts, fetchLikesData, handleLike, Post } from '@/services/posts';
import { fetchComments, addComment } from '@/services/commentService';

const { width } = Dimensions.get('window');

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<boolean[]>([]);
  const [currentIndexes, setCurrentIndexes] = useState<number[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({}); // Stockage des commentaires par post
  const [newComment, setNewComment] = useState<string>(''); // Nouveau commentaire

  useEffect(() => {
    const loadPosts = async () => {
        try {
            const postsData = await fetchAllPosts(); // Récupérer tous les posts
            setPosts(postsData);

            const likeCountsArray: number[] = [];
            const likedPostsArray: boolean[] = [];

            // Récupérer les données des likes pour chaque post
            for (const post of postsData) {
                const { likeCounts, likedPosts } = await fetchLikesData(post.id);
                likeCountsArray.push(likeCounts[0] || 0);
                likedPostsArray.push(likedPosts[0] || false);
            }

            setLikeCounts(likeCountsArray); // Mettre à jour les likes
            setLikedPosts(likedPostsArray); // Mettre à jour l'état des likes

            setCurrentIndexes(new Array(postsData.length).fill(0)); // Initialiser les index des images
            setLoading(false); // Arrêter le chargement

            // Charger les commentaires pour chaque post
            const commentsData: { [key: number]: string[] } = {};
            for (const post of postsData) {
                const postComments = await fetchComments(post.id);
                commentsData[post.id] = postComments.map((comment: any) => comment.content); // Stocker les commentaires
            }
            setComments(commentsData);
        } catch (error) {
            console.error("Erreur lors du chargement des posts ou des commentaires", error);
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

  const handleAddComment = async (postId: number, commentContent: string) => {
    if (!commentContent.trim()) return; // Ne pas envoyer de commentaire vide
    try {
      const newComment = await addComment(postId, commentContent, 1, 'UserName'); // Remplacer '1' et 'UserName' par l'ID et le nom de l'utilisateur
      setComments(prevComments => ({
        ...prevComments,
        [postId]: [...prevComments[postId], newComment.content] // Ajouter le commentaire à l'état
      }));
      setNewComment(''); // Réinitialiser le champ de commentaire
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire', error);
    }
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
              color={likedPosts[index] ? "beige" : "white"}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <Text style={{ color: "white", marginRight: 30 }}>{likeCounts[index]}</Text>

          <TouchableOpacity style={styles.icon}>
            <AntDesign name="message1" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={{ fontWeight: "bold", color: "white" }}>{item.userName} </Text>
        <Text style={{ color: "white" }}>{item.content}</Text>
      </View>

      <FlatList
        data={comments[item.id] || []} // Utilisation des commentaires pour ce post
        keyExtractor={(comment, index) => index.toString()}
        renderItem={({ item: comment }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        )}
        style={styles.commentList}
      />

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Ajouter un commentaire..."
          placeholderTextColor="white"
          value={newComment} // Afficher le commentaire actuel
          onChangeText={setNewComment} // Mettre à jour l'état du commentaire
        />
        <TouchableOpacity onPress={() => handleAddComment(item.id, newComment)} style={styles.commentIcon}>
          <AntDesign name="enter" size={24} color="white" />
        </TouchableOpacity>
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
        contentContainerStyle={{ padding: 0 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 50,
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
    width,
    height: 300,
    marginBottom: 10,
  },
  iconsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  icon: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    display: "flex",
    flexDirection: "row"
  },
  commentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  commentText: {
    color: 'white',
    fontSize: 14,
  },
  commentList: {
    marginTop: 10,
  },
  commentInput: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentIcon: {
    marginLeft: 10,
  },
});
