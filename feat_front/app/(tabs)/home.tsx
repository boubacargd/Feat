import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity, View, Image, Dimensions, ActivityIndicator, TextInput, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { fetchAllPosts, fetchLikesData, handleLike, Post } from '@/services/posts';
import { fetchComments, addComment, fetchMultipleUserDetails } from '@/services/commentService'; // Assurez-vous d'ajouter la fonction addComment
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { jwtDecode } from "jwt-decode";
const { width } = Dimensions.get('window');

export default function Home() {


  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<boolean[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [userDetails, setUserDetails] = useState<{ [userId: number]: { firstName: string; lastName: string } }>({}); const [newComment, setNewComment] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const openModal = (postId: number) => {
    setSelectedPostId(postId);
    setNewComment('');
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPostId(null);
    setIsModalVisible(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const postsData = await fetchAllPosts();
        console.log("Posts récupérés:", postsData);

        const commentsData: { [key: number]: string[] } = {};
        const likeCountsArray: number[] = [];
        const likedPostsArray: boolean[] = [];

        const userIds: Set<number> = new Set();  // Utilise un Set pour collecter les `userId` uniques

        for (const post of postsData) {
          const postComments = await fetchComments(post.id);
          console.log("Commentaires pour le post:", post.id, postComments);

          commentsData[post.id] = postComments.map((comment: any) => comment.content);

          const { likeCounts, likedPosts } = await fetchLikesData(post.id);
          likeCountsArray.push(likeCounts[0] || 0);
          likedPostsArray.push(likedPosts[0] || false);

          // Collecte tous les `userId` des commentaires
          postComments.forEach((comment: any) => {
            if (comment.userId) {
              userIds.add(comment.userId);
            }
          });
        }

        // Récupère les détails des utilisateurs en une seule requête
        const userDetails = await fetchMultipleUserDetails(Array.from(userIds));
        console.log("Tous les détails des utilisateurs:", userDetails);

        setComments(commentsData);
        setLikeCounts(likeCountsArray);
        setLikedPosts(likedPostsArray);
        setUserDetails(userDetails);  // Mets à jour l'état avec les détails des utilisateurs
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des posts, commentaires ou likes", error);
      }
    };

    loadData();
  }, []);


  const handleAddComment = async (commentContent: string) => {
    if (!commentContent.trim()) return;

    const token = await AsyncStorage.getItem('jwt_token');
    if (!token) {
      console.error("Token JWT non trouvé");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.userId || await AsyncStorage.getItem('userId');
      const userName = `${decodedToken?.firstName || ''} ${decodedToken?.lastName || ''}`;

      if (!userId || !selectedPostId) {
        console.error("User ID ou Post ID manquants");
        return;
      }

      const newComment: Comment = await addComment(selectedPostId, commentContent, parseInt(userId, 10), userName);

      setComments((prevComments) => ({
        ...prevComments,
        [selectedPostId]: [...(prevComments[selectedPostId] || []), newComment],
      }));
      setNewComment('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire", error);
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
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.iconsContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => handleLike(index, item.id, likedPosts, setLikedPosts, likeCounts, setLikeCounts)}>
            <AntDesign name={likedPosts[index] ? "heart" : "hearto"} size={20} color={likedPosts[index] ? "beige" : "white"} style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <Text style={{ color: "white", marginRight: 30 }}>{likeCounts[index]}</Text>

          <TouchableOpacity style={styles.icon} onPress={() => openModal(item.id)}>
            <AntDesign name="message1" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={{ fontWeight: "bold", color: "white" }}>{item.userName} </Text>
        <Text style={{ color: "white" }}>{item.content}</Text>
      </View>

      <Modal
        visible={isModalVisible && selectedPostId === item.id}  // Vérifier si le post est sélectionné
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          onPress={closeModal}
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />
        <View style={[{ backgroundColor: 'black', height: 550 }]}>
          <View style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 10, paddingTop: 10, borderBottomColor: "grey", borderWidth: 0.2, width: "100%" }}>
            <Text style={{ color: "white" }} >Comments</Text>
          </View>

          <FlatList
            data={comments[item.id] || []}
            keyExtractor={(comment, index) => index.toString()}
            renderItem={({ item: comment }) => {
              const userDetail = userDetails[comment.userId]; // Basé sur `userId`
              return (
                <View style={styles.commentContainer}>
                  <Text style={styles.commentText}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {userDetail
                        ? `${userDetail.firstName} ${userDetail.lastName}`
                        : 'Utilisateur inconnu'}:
                    </Text>{' '}
                    {comment.content}
                  </Text>
                </View>
              );
            }}
          />


          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add comments..."
              placeholderTextColor="#aaa"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              onPress={() => handleAddComment(newComment)}  // Utiliser `newComment` sans passer d'ID
              style={styles.commentIcon}
            >
              <MaterialIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="black" style={{ margin: "auto" }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1f1f1f" }}>
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
    flexDirection: "row",
  },
  commentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderWidth: 0.2,
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
    borderRadius: 8,
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderTopColor: "grey",
    borderTopWidth: 1,
    paddingTop: 10
  },
  commentIcon: {
    marginLeft: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: "white",
    padding: 10
  },
});
