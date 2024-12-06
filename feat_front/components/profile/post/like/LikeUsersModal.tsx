import React from "react";
import { Modal, View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type LikeUsersModalProps = {
    visible: boolean;
    onClose: () => void;
    users: { id: number; name: string; profileImageUrl: string }[];
};

export function LikeUsersModal({ visible, onClose, users }: LikeUsersModalProps) {
    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Utilisateurs ayant liké</Text>
                <FlatList
                    data={users}
                    keyExtractor={(user) => user.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userContainer}>
                            <Image source={{ uri: item.profileImageUrl }} style={styles.userAvatar} />
                            <Text style={styles.userName}>{item.name}</Text>
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    closeButton: {
        alignSelf: "flex-end",
        top: 50,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10,
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
    },
});
