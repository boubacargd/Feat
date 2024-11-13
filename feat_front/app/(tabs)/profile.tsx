import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Dimensions, ActivityIndicator, Text } from 'react-native';
import useStyles from '../../styles/styleSheet';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Link, useRouter } from 'expo-router';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Pour utiliser la navigation

const { width } = Dimensions.get("window");
const userImageHeight = 300;

export default function Profile() {
    const styles = useStyles();
    const router = useRouter();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useSharedValue(0);

    const [userInfo, setUserInfo] = useState<{ name: string; country: string; activities: string, imageUrl: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [navigating, setNavigating] = useState(false);

    const navigation = useNavigation(); // Utilisation du hook de navigation

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });

    const isValidJWT = (token: string) => {
        return token && token.split('.').length === 3;
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('jwt_token');

            if (!token) {
                setNavigating(true);
                return; // Sortie de la fonction
            }

            if (isValidJWT(token)) {
                await fetchUserInfo(token);
            } else {
                setNavigating(true);
            }
        };

        checkToken();
    }, []);

/*     useEffect(() => {
        if (navigating) {
            navigation.navigate('/home');
        }
    }, [navigating, navigation]); */

    const fetchUserInfo = async (token: string) => {
        setLoading(true);

        try {
            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken.sub;

            const response = await axios.get('http://localhost:8080/api/user/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { email: userEmail }
            });

            const imageUrl = response.data.imageUrl
                ? `http://localhost:8080/uploads/${response.data.imageUrl}`
                : "https://as2.ftcdn.net/v2/jpg/06/85/17/31/1000_F_685173149_MsBL8hirpNeAglmgEKBXXPNk5dk6SA45.jpg";

            setUserInfo({
                name: `${response.data.firstName} ${response.data.lastName}`,
                country: response.data.country || "",
                activities: response.data.activities, 
                imageUrl: imageUrl
            });
        } catch (error) {
            console.error('Fetch user info error:', error);
        } finally {
            setLoading(false);
        }
    };

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const height = interpolate(
            scrollOffset.value,
            [0, userImageHeight],
            [userImageHeight, 1]
        );

        const opacity = interpolate(
            scrollOffset.value,
            [0, userImageHeight],
            [1, 0]
        );

        return {
            height,
            opacity,
        };
    });

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');
            if (token) {
                // Appelez le point de terminaison de déconnexion
                await axios.post('http://localhost:8080/api/public/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            // Supprimez le token du stockage local après déconnexion
            await AsyncStorage.removeItem('jwt_token');
            // Naviguez vers l'écran de connexion ou un autre écran approprié
            router.push("/login")
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="small" color="black" style={{ margin: "auto" }} />;
    }

    if (userInfo) {
        const { name, country, activities, imageUrl } = userInfo;

        return (
            <SafeAreaView style={[styles.container, themeContainerStyle]}>
                <Animated.ScrollView
                    ref={scrollRef}
                    scrollEventThrottle={0}
                    onScroll={scrollHandler}
                    style={{ flex: 1, zIndex: 1}}
                >
                    <Animated.Image
                        source={{ uri: imageUrl }}
                        style={[{
                            width,
                            height: userImageHeight,
                        }, imageAnimatedStyle]}
                        onError={(error) => {
                            console.error('Error loading image:', error.nativeEvent.error);
                        }}
                    />
                    <View style={{ padding: 20 }}>
                        <Text style={[styles.textH3Bold, themeTextStyle]}>{name || ''}</Text>
                        <Text style={[styles.textH3, themeTextStyle]}>{country || ''}</Text>
                        <Text style={[styles.textH3, themeTextStyle]}>{activities || ''}</Text>
                    </View>
                </Animated.ScrollView>

                <Text style={{ padding: 20, backgroundColor:"red" }} onPress={handleLogout}>logout</Text>
            </SafeAreaView>
        );
    }

    return null;
}
