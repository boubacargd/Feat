import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import useStyles from '../../styles/styleSheet';
import { useTheme } from '../../hooks/useTheme';
import i18n from '../i18n';
import { Link, useRouter } from 'expo-router';
import LogoFeat from '@/components/logo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const styles = useStyles();
    const {
        themeTextStyle,
        themeContainerStyle,
        themeBackgroundColorBtn,
        themeButtonTextColor,
    } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Google OAuth Configuration
    const { iosClientId, androidClientId, clientId } = Constants.expoConfig?.extra?.googleOAuth || {};
      
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId,
        iosClientId,
        androidClientId,
        scopes: ['email', 'profile'],
        redirectUri: 'com.boubacargd.feat:/oauth2callback',        });

    // Handle Google OAuth response
    useEffect(() => {
        console.log('OAuth Response:', response);

        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.idToken) {
                sendTokenToBackend(authentication.idToken);
            }
        } else if (response?.type === 'error') {
            console.error('OAuth Error:', response.error?.description);
            Alert.alert('Error', `Authentication failed: ${response.error?.description}`);
        }
    }, [response]);


    const sendTokenToBackend = async (token: string) => {
        console.log("Sending token to backend:", token); // Déboguer le token
        try {
            const res = await axios.post('http://localhost:8080/api/public/google', { token });
            const { jwt, user } = res.data;
            await AsyncStorage.setItem('jwt_token', jwt);
            Alert.alert('Success', `Logged in as ${user.email}`);
            router.push('/profile');
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Error', 'Google login failed.');
        }
    };
    
    
    

    const handleGoogleLogin = async () => {
        if (isAuthenticating) return;

        setIsAuthenticating(true);
        try {
            await promptAsync();
        } catch (error) {
            console.error('Google login failed:', error);
            Alert.alert('Error', 'Google login failed.');
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/public/signin', {
                email,
                password,
            });

            const token = response.data;
            if (!token) {
                throw new Error('Token is missing in the response.');
            }

            await AsyncStorage.setItem('jwt_token', token);

            Alert.alert('Success', 'Login successful!');
            router.push('/home');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Login error (Axios):', error.response?.data || error.message);
                Alert.alert('Error', `Login failed: ${error.response?.data || error.message}`);
            } else {
                console.error('Login error:', error);
                Alert.alert('Error', 'Failed to login. Please check your credentials.');
            }
        }
    };

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>
            <LogoFeat />

            <View style={styles.containerForm}>
                <View>
                    <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t('infoUser.email')}</Text>
                    <TextInput
                        placeholder="example@gmail.com"
                        placeholderTextColor="#6a6a6a"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.authInput}
                    />

                    <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t('infoUser.password')}</Text>
                    <TextInput
                        secureTextEntry
                        placeholder={i18n.t('infoUser.password')}
                        placeholderTextColor="#6a6a6a"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.authInput}
                    />

                    <TouchableOpacity style={styles.passwordForget}>
                        <Text style={{ fontWeight: '300', fontSize: 13 }}>{i18n.t('auth.passwordForget')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.authBtnLogin} onPress={handleLogin}>
                        <Text style={[styles.authBtnText, themeButtonTextColor]}>{i18n.t('auth.signin')}</Text>
                    </TouchableOpacity>

                    <View style={styles.askAccountText}>
                        <Text style={[styles.textH3, themeTextStyle]}>{i18n.t('auth.askRegistration')} </Text>
                        <Link href="/register">
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t('auth.signup')}</Text>
                        </Link>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 50 }}>
                        <View style={styles.lineOr} />
                        <Text style={[{ padding: 10 }, themeTextStyle]}>{i18n.t('auth.or')}</Text>
                        <View style={styles.lineOr} />
                    </View>

                    <TouchableOpacity
                        style={[styles.authBtnLoginGoogle]}
                        onPress={handleGoogleLogin}
                        disabled={!request || isAuthenticating}
                    >
                        <Ionicons name="logo-google" size={22} style={[{ paddingRight: 10 }, themeTextStyle]} />
                        <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t('auth.signinGoogle')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
