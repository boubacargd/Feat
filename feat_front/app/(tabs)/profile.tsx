import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Dimensions, ActivityIndicator, Text, ScrollView } from 'react-native';
import useStyles from '../../styles/styleSheet';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Link, useRouter } from 'expo-router';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Pour utiliser la navigation
import UserInfo from '../../components/profile/UserInfo';
import { UserStats } from '@/components/profile/UserStats';
import { UserSettings } from '@/components/profile/UserSettings';
import { UserEditButton } from '@/components/profile/UserEditButton';
import { UserPostButton } from '@/components/profile/UserPostButton';
import { UserPosts } from '@/components/profile/post/UserPosts';
import { ProjectsCollabsBtn } from '@/components/ProjectsCollabsBtn';

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
                ? response.data.imageUrl
                : "http://localhost:8080/uploads/1731499742849_photo.jpg";

            const { name, country } = response.data;
            setUserInfo({
                name: name,
                country: country,
                activities: response.data.activities,
                imageUrl: imageUrl || "loading"
            });
        } catch (error) {
            console.error('Fetch user info error:', error);
        } finally {
            setLoading(false);
        }
    };

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

        return (
            <SafeAreaView style={styles.container}>

                <ScrollView>

                    <UserInfo
                        name={userInfo.name}
                        country={userInfo.country}
                        activities={userInfo.activities}
                        imageUrl={userInfo.imageUrl}
                        themeTextStyle={themeTextStyle}
                    />
                        
                    <UserStats />
                    <ProjectsCollabsBtn/>
                    <UserPosts />

                    <Text style={{ padding: 10, marginTop: 50, backgroundColor: "red" }} onPress={handleLogout}>logout</Text>
                </ScrollView>
                <UserPostButton />

            </SafeAreaView>
        );
    }

    return null;
}
