import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStyles from "@/styles/styleSheet";
import { PostModalOption } from "./PostModalOption";

type PostProps = {
    post: {
        id: number;
        userName: string;
        content: string;
        imageUrl: string[];
        userImageUrl: string;
        timeAgo?: string;
    };
    handleOptionClick: (post: any) => void;
};

export function Post({ post, handleOptionClick }: PostProps) {
    const styles = useStyles();

    return (
        <View style={styles.postCard}>
        

            <Text style={styles.postContent}>{post.content}</Text>

            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.postImages}
            >
                {post.imageUrl.map((imageUri, index) => (
                    <Image key={index} source={{ uri: imageUri }} style={{ width: 200, height: 200, marginRight: 10 }} />
                ))}
            </ScrollView>
        </View>
    );
}
