import React from "react";
import { Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity } from "react-native";
import useStyles from "@/styles/styleSheet";

type PostModalOptionProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPost: any; // Replace with your post type if needed
  handleEditDescription: () => void;
  handleSharePost: () => void;
  handleDeletePost: () => void;
};

export function PostModalOption({
  modalVisible,
  setModalVisible,
  selectedPost,
  handleEditDescription,
  handleSharePost,
  handleDeletePost,
}: PostModalOptionProps) {
  
  const styles = useStyles();

  return (
    <>
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
              <Text style={[styles.modalOption, { color: "red" }]}>Éliminer</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
}
