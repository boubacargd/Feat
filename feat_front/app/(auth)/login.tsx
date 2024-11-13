import React, { useState } from 'react'
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import useStyles from '../../styles/styleSheet'
import { useTheme } from '../../hooks/useTheme';
import i18n from '../i18n';
import { Link, useRouter } from 'expo-router';
import LogoFeat from '@/components/logo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function login() {
    const styles = useStyles();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        try {
            // Remplacez `localhost` par l’adresse IP de votre machine ou `10.0.2.2` si vous êtes sur l’émulateur Android
            const response = await axios.post('http://localhost:8080/api/public/signin', {
                email,
                password,
            });

            // Vérifiez si la réponse contient un token
            const token = response.data;
            if (!token) {
                throw new Error('Token is missing in the response.');
            }

            console.log('Login successful. Token:', token);

            // Stocker le token dans AsyncStorage
            await AsyncStorage.setItem('jwt_token', token);

            Alert.alert("Success", "Login successful!");
            router.push("/home")
        } catch (error) {
            // Afficher les détails de l'erreur pour un meilleur débogage
            if (axios.isAxiosError(error)) {
                console.error('Login error (Axios):', error.response?.data || error.message);
                Alert.alert("Error", `Login failed: ${error.response?.data || error.message}`);
            } else {
                console.error('Login error:', error);
                Alert.alert("Error", "Failed to login. Please check your credentials.");
            }
        }
    };
    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>

            <LogoFeat />

            <View style={styles.containerForm}>

                <View>

                    <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.email")}</Text>
                    <TextInput
                        placeholder="example@gmail.com"
                        placeholderTextColor="#6a6a6a"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.authInput}
                    />

                    <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.password")}</Text>
                    <TextInput
                        secureTextEntry
                        placeholder={i18n.t('infoUser.password')}
                        placeholderTextColor="#6a6a6a"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.authInput}
                    />

                    <TouchableOpacity style={styles.authBtnLogin} onPress={() => ""}>
                        <Link href="/addImageProfile">
                            <Text style={styles.authBtnText} onPress={handleLogin} >{i18n.t("auth.signin")}</Text>
                        </Link>
                    </TouchableOpacity>

                    <View style={styles.askAccountText} >
                        <Text style={[styles.textH3, themeTextStyle]}>{i18n.t("auth.askRegistration")} </Text>

                        <Link href="/register">
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("auth.signup")}</Text>
                        </Link>

                    </View>
                </View>

            </View>

        </SafeAreaView>
    )
}

