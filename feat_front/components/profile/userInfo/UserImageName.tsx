import React, { useRef } from 'react';
import { View, Text, Image, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Utilisez expo-linear-gradient si vous utilisez Expo

const { width } = Dimensions.get('window');

interface UserImageNameProps {
    name: string;
    country: string;
    activities: string;
    imageUrl: string;
}

export default function UserImageName({ name, country, activities, imageUrl }: UserImageNameProps) {
    const scrollY = useRef(new Animated.Value(0)).current;

    const HEADER_HEIGHT = 70; // Hauteur du header fixe

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {/* Header animé */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        height: HEADER_HEIGHT,
                        backgroundColor: scrollY.interpolate({
                            inputRange: [0, 150],
                            outputRange: ['transparent', 'rgba(0, 0, 0, 0.8)'], // Dégradé vers un noir opaque
                            extrapolate: 'clamp',
                        }),
                    },
                ]}
            >
                <Animated.Text
                    style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                        opacity: scrollY.interpolate({
                            inputRange: [100, 150],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    }}
                >
                    {name}
                </Animated.Text>
            </Animated.View>

            {/* Contenu principal */}
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 0 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false } // Si le problème persiste, désactivez temporairement
                )}
                scrollEventThrottle={16}
            >
                {/* Image avec le texte */}
                <View style={{ position: 'relative' }}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={{
                            width,
                            height: 300,
                        }}
                    />
                    <LinearGradient
                        colors={['transparent', 'black']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 100, // Hauteur du dégradé
                        }}
                    />
                    {/* Texte sur l'image */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            bottom: 10,
                            left: 10,
                            opacity: scrollY.interpolate({
                                inputRange: [0, 150],
                                outputRange: [1, 0],
                                extrapolate: 'clamp',
                            }),
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 30,
                                fontWeight: '800',
                                textShadowColor: 'black',
                                textShadowOffset: { width: 1, height: 1 },
                                textShadowRadius: 5,
                            }}
                        >
                            {name}
                        </Text>
                    </Animated.View>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: 'gray',
    },
});
