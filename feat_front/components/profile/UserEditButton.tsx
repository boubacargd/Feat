import React from "react";
import { View, Text } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from "../../hooks/useTheme";
import useStyles from "@/styles/styleSheet";

export function UserEditButton() {
    const styles = useStyles()
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();

    return (
        <View style={styles.profileActionsBtn}>
            <Feather name="edit-3" size={20} style={[{paddingRight:10} , themeTextStyle]} />
            <Text style={[styles.textH3, themeTextStyle ]}>Edit Profile</Text>
        </View>
    );
}