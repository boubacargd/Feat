import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useStyles from "@/styles/styleSheet";

export function ProjectsCollabsBtn() {
    const styles = useStyles();
    const [activeButton, setActiveButton] = useState("Projects");

    return (
        <View style={styles.containerPojectsCollabsBtn}>
            {/* Bouton Projects */}
            <TouchableOpacity
                style={[
                    styles.buttonProjectsCollabs,
                    activeButton === "Projects" && styles.activeButton, // Si actif, appliquer le style actif
                ]}
                onPress={() => setActiveButton("Projects")} // Définit "Projects" comme actif
            >
                <Text
                    style={[
                        styles.buttonTextProjectsCollabs,
                        activeButton === "Projects" && styles.activeButtonText,
                    ]}
                >
                    Projects
                </Text>
            </TouchableOpacity>

            {/* Bouton Collabs */}
            <TouchableOpacity
                style={[
                    styles.buttonProjectsCollabs,
                    activeButton === "Collabs" && styles.activeButton, // Si actif, appliquer le style actif
                ]}
                onPress={() => setActiveButton("Collabs")} // Définit "Collabs" comme actif
            >
                <Text
                    style={[
                        styles.buttonTextProjectsCollabs,
                        activeButton === "Collabs" && styles.activeButtonText,
                    ]}
                >
                    Collabs
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
   
});
