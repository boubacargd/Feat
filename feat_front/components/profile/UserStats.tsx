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
                <Text style={[styles.textStats, themeTextStyle]}>35</Text>
                <Text style={[styles.textLabel, themeTextStyle]}>Projects</Text>
            </View>

            <View style={[styles.viewStats, styles.middleStats]}>
                <Text style={[styles.textStats, themeTextStyle]}>2390</Text>
                <Text style={[styles.textLabel, themeTextStyle]}>Followers</Text>
            </View>

            <View style={styles.viewStats}>
                <Text style={[styles.textStats, themeTextStyle]}>9</Text>
                <Text style={[styles.textLabel, themeTextStyle]}>Collabs</Text>
            </View>
        </View>
    );
}
