import { useState } from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useStyles from "@/styles/styleSheet";
import { ModalPost } from "./post/PostModal";
import { useTheme } from "@/hooks/useTheme";

export function UserPostButton() {
  const styles = useStyles();
  const { themeButtonTextColor } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false); // État pour afficher/masquer le modal

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <View>

      <TouchableOpacity onPress={openModal} style={styles.postButton} >
        <MaterialIcons name="add" size={35} style={[themeButtonTextColor]} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={closeModal} >
        
        <View style={styles.modalContainer} >
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={"red"} />
            </TouchableOpacity>            
            <ModalPost closeModal={closeModal} />
          </View>
        </View>
      
      </Modal>

    </View>

  );
}