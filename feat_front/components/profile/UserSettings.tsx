import React from "react";
import { View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import useStyles from "@/styles/styleSheet";
import { useTheme } from "@/hooks/useTheme";
export function UserSettings() {
    const styles = useStyles();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();

    return (

        <View
            style={styles.profileActionsBtn}>
            <Ionicons name="settings-outline" size={20} style={[{paddingRight:10} , themeTextStyle]}  />
            <Text style={[styles.textH3, themeTextStyle]}>Settings</Text>
        </View>
    );
}