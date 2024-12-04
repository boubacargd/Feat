import React from "react";
import { View, Text } from "react-native";
import useStyles from "../../styles/styleSheet";
import { useTheme } from "../../hooks/useTheme";

export function UserStats() {
    const styles = useStyles();
    const { themeTextStyle, themeBorderColor } = useTheme();

    return (
        <View style={styles.containerUserStats}>
            <View style={styles.viewStats}>
                <Text style={[styles.textStats]}>39</Text>
                <Text style={[styles.textLabel]}>Projects,</Text>
            </View>

            <View style={[styles.viewStats]}>
                <Text style={[styles.textStats]}>2390</Text>
                <Text style={[styles.textLabel]}>Followers,</Text>
            </View>

            <View style={styles.viewStats}>
                <Text style={[styles.textStats]}>9</Text>
                <Text style={[styles.textLabel]}>Collabs.</Text>
            </View>
        </View>
    );
}
