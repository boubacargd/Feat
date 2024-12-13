import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity, View, Image, Dimensions, ActivityIndicator, TextInput, StyleSheet, PanResponder, Modal, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { fetchAllPosts, fetchLikesData, handleLike, Post } from '@/services/posts';
import { fetchComments, addComment, deleteComment } from '@/services/commentService'; // Assurez-vous d'ajouter la fonction deleteComment dans votre service
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useStyles from '@/styles/styleSheet';

const { width } = Dimensions.get('window');

export default function Home() {
  const styleSheet = useStyles();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<boolean[]>([]);
  const [currentIndexes, setCurrentIndexes] = useState<number[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [newComment, setNewComment] = useState<string>('');
  const [deletedCommentId, setDeletedCommentId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchAllPosts();
        setPosts(postsData);

        const likeCountsArray: number[] = [];
        const likedPostsArray: boolean[] = [];

        for (const post of postsData) {
          const { likeCounts, likedPosts } = await fetchLikesData(post.id);
          likeCountsArray.push(likeCounts[0] || 0);
          likedPostsArray.push(likedPosts[0] || false);
        }

        setLikeCounts(likeCountsArray);
        setLikedPosts(likedPostsArray);

        setCurrentIndexes(new Array(postsData.length).fill(0));
        setLoading(false);

        const commentsData: { [key: number]: string[] } = {};
        for (const post of postsData) {
          const postComments = await fetchComments(post.id);
          commentsData[post.id] = postComments.map((comment: any) => comment.content);
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
    if (!commentContent.trim()) return;
    try {
      const newComment = await addComment(postId, commentContent, 1, 'UserName');
      setComments(prevComments => ({
        ...prevComments,
        [postId]: [...prevComments[postId], newComment.content]
      }));
      setNewComment('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire', error);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      await deleteComment(commentId); // Suppression du commentaire
      setComments(prevComments => ({
        ...prevComments,
        [postId]: prevComments[postId].filter((_, index) => index !== commentId)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire', error);
    }
  };

  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dx < -100) { // Condition pour détecter le glissement
          setDeletedCommentId(index); // Afficher le bouton de suppression
        }
      },
    });

    return (
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
              <AntDesign name={likedPosts[index] ? "heart" : "hearto"} size={20} color={likedPosts[index] ? "beige" : "white"} style={{ marginRight: 10 }} />
            </TouchableOpacity>
            <Text style={{ color: "white", marginRight: 30 }}>{likeCounts[index]}</Text>

            <TouchableOpacity style={styles.icon} onPress={openModal}>
              <AntDesign name="message1" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={{ fontWeight: "bold", color: "white" }}>{item.userName} </Text>
          <Text style={{ color: "white" }}>{item.content}</Text>
        </View>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={[styleSheet.modalContainer, { backgroundColor: "black" }]}>
                <FlatList
                  data={comments[item.id] || []}
                  keyExtractor={(comment, index) => index.toString()}
                  renderItem={({ item: comment, index }) => (
                    <View style={styles.commentContainer}>
                      <Text style={styles.commentText}>{comment}</Text>
                      {deletedCommentId === index && (
                        <TouchableOpacity onPress={() => handleDeleteComment(item.id, index)} style={styles.deleteButton}>
                          <AntDesign name="delete" size={20} color="red" />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                />
                <TouchableOpacity onPress={closeModal} style={styleSheet.closeButton}>
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>




      </View>
    );
  };

  if (loading) {
    return <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        backgroundColor: "black",
        width: "100%",
        height: "100%"
      }}
    >
      <ActivityIndicator size="large" color="white" />;
    </View>
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
    paddingVertical: 5,
    position: 'relative',
    borderWidth: 0.2,
    borderTopColor: "white",
    height: 50
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
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: "white",
    padding: 10
  },
});
