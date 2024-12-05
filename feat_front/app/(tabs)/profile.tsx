import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Dimensions, ActivityIndicator, Text, ScrollView } from 'react-native';
import useStyles from '../../styles/styleSheet';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UserImageName from '../../components/profile/userInfo/UserImageName';
import { UserStats } from '@/components/profile/UserStats';
import { PostList } from '@/components/profile/post/PostList';
import { UserPostButton } from '@/components/profile/UserPostButton';
import UserActivitiesCountry from '@/components/profile/userInfo/UserActivitiesCountry';

const { width } = Dimensions.get("window");

export default function Profile() {
    const styles = useStyles();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<{ name: string; country: string; activities: string, imageUrl: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderedPosts, setOrderedPosts] = useState<any[]>([]); // Posts triés

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('jwt_token');

            if (!token) {
                router.push("/login");
                return;
            }

            if (isValidJWT(token)) {
                await fetchUserInfo(token); // Récupère uniquement les infos utilisateur
                await fetchOrderedPosts(token); // Appel pour les posts triés
            } else {
                router.push("/login");
            }
        };

        checkToken();
    }, []);

    const isValidJWT = (token: string) => {
        return token && token.split('.').length === 3;
    };

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

            const { name, country, activities, imageUrl } = response.data;
            setUserInfo({
                name,
                country,
                activities,
                imageUrl: imageUrl || "loading"
            });
        } catch (error) {
            console.error('Fetch user info error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderedPosts = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:8080/api/posts/ordered', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Posts triés récupérés:", response.data);
            setOrderedPosts(response.data); // Mettez à jour l'état des posts triés
        } catch (error) {
            console.error("Erreur lors de la récupération des posts triés:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');
            if (token) {
                await axios.post('http://localhost:8080/api/public/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            await AsyncStorage.removeItem('jwt_token');
            router.push("/login")
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="small" color="black" style={{ margin: "auto" }} />;
    }

    if (userInfo) {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <UserImageName
                        name={userInfo.name}
                        country={userInfo.country}
                        activities={userInfo.activities}
                        imageUrl={userInfo.imageUrl}
                    />
                    <UserActivitiesCountry
                        country={userInfo.country}
                        activities={userInfo.activities}
                    />
                    <UserStats />

                    <PostList posts={orderedPosts} />
                </ScrollView>
                <Text style={{ margin: "auto", color: "white", padding: 20, fontWeight: 700, }} onPress={handleLogout}>Logout</Text>
                <UserPostButton />
            </View>
        );
    }

    return null;
}
