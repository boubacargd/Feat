import React, { useState, useEffect } from 'react'
import { SafeAreaView, TouchableOpacity, View, Text, TextInput, ActivityIndicator, Alert } from 'react-native'
import i18n from '../../i18n';
import useStyles from '../../../styles/styleSheet'
import { useTheme } from '../../../hooks/useTheme';
import Octicons from '@expo/vector-icons/Octicons';
import LogoFeat from '@/components/logo';
import RNPickerSelect from 'react-native-picker-select';
import axios , { AxiosError } from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Link, useRouter } from 'expo-router';

export default function register() {
    const styles = useStyles();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [activities, setActivities] = useState('');
    const [country, setCountry] = useState<string | null>(null);
    const [items, setItems] = useState<Array<{ label: string, value: string }>>([]);
    const [loading, setLoading] = useState<boolean>(true);




    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
    
        const userData = {
            firstName,
            lastName,
            email,
            password,
            activities,
            country
        };
    
        try {
            const response = await axios.post('http://localhost:8080/api/public/signup', userData);
            console.log("User Data:", userData);
            console.log('User signed up successfully:', response.data);
            Alert.alert("Success", "User registered successfully!");
    
            const token = response.data.jwtToken; // Récupérer le token JWT depuis la réponse
    
            if (token) {
                await AsyncStorage.setItem('jwt_token', token); // Stocker le token dans AsyncStorage
                console.log("Token stored successfully");
    
                // Naviguer vers AddImgProfil ou une autre page après l'inscription
                router.push({ pathname: '/(auth)/(register)/addImageProfile', params: { email } });
            } else {
                console.error("No token found in response");
                Alert.alert("Error", "No token found. Please try again.");
            }
    
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                console.log('Error status:', axiosError.response.status);
                console.log('Error data:', axiosError.response.data);
                console.log('Error headers:', axiosError.response.headers);
            } else {
                console.error('Error without response:', axiosError.message);
            }
            Alert.alert("Error", "Failed to sign up. Please try again.");
        }
    };
    
    

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
            .then(response => {
                const sortedCountries = response.data
                    .map((country: any) => ({
                        label: `${country.name.common} (${country.cca2})`,
                        value: country.cca2,
                        flag: country.flags.svg || country.flags.png, // URL du drapeau
                    }))
    
                setItems(sortedCountries);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
                setLoading(false);
            });
    }, []);
    

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    return (
        <SafeAreaView style={[styles.container, themeContainerStyle]}>


            <LogoFeat />
            <View style={styles.containerForm}>
                <View>

                    {step === 1 && (
                        <View>

                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.firstName")}</Text>
                            <TextInput
                                placeholder={i18n.t('infoUser.firstName')}
                                placeholderTextColor="#6a6a6a"
                                value={firstName}
                                onChangeText={setFirstName}
                                style={styles.authInput}
                            />
                            <View style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginTop:10 }}>
                                <TouchableOpacity style={[styles.continueBtn, { backgroundColor: themeBackgroundColorBtn.backgroundColor }]} onPress={handleNextStep} >
                                    <Text style={[styles.textH3Bold, themeButtonTextColor]}>{i18n.t("auth.continue")}</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    )}

                    {step === 2 && (
                        <View>
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.lastName")}</Text>
                            <TextInput
                                placeholder={i18n.t('infoUser.lastName')}
                                placeholderTextColor="#6a6a6a"
                                value={lastName}
                                onChangeText={setLastName}
                                style={styles.authInput}
                            />
                            <View style={styles.navForm}>

                                <TouchableOpacity onPress={handlePreviousStep}>
                                    <Octicons name="chevron-left" size={28} color="#6a6a6a" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.continueBtn, { backgroundColor: themeBackgroundColorBtn.backgroundColor }]} onPress={handleNextStep} >
                                    <Text style={[styles.textH3Bold, themeButtonTextColor]}>{i18n.t("auth.continue")}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    )}

                    {step === 3 && (
                        <View>
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.email")}</Text>
                            <TextInput
                                placeholder="example@gmail.com"
                                placeholderTextColor="#6a6a6a"
                                value={email}
                                onChangeText={(text) => setEmail(text.toLowerCase())}
                                style={styles.authInput}
                            />
                            <View style={styles.navForm}>
                                <TouchableOpacity onPress={handlePreviousStep}>
                                    <Octicons name="chevron-left" size={28} color="#6a6a6a" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.continueBtn, { backgroundColor: themeBackgroundColorBtn.backgroundColor }]} onPress={handleNextStep} >
                                    <Text style={[styles.textH3Bold, themeButtonTextColor]}>{i18n.t("auth.continue")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 4 && (
                        <View>
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.password")}</Text>
                            <TextInput
                                secureTextEntry
                                placeholder={i18n.t('infoUser.password')}
                                placeholderTextColor="#6a6a6a"
                                value={password}
                                onChangeText={setPassword}
                                style={styles.authInput}

                            />
                            <View style={styles.navForm}>
                                <TouchableOpacity onPress={handlePreviousStep}>
                                    <Octicons name="chevron-left" size={28} color="#6a6a6a" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.continueBtn, { backgroundColor: themeBackgroundColorBtn.backgroundColor }]} onPress={handleNextStep} >
                                    <Text style={[styles.textH3Bold, themeButtonTextColor]}>{i18n.t("auth.continue")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {step === 5 && (
                        <View>
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.confirmPassword")}</Text>
                            <TextInput
                                secureTextEntry
                                placeholder={i18n.t('infoUser.confirmPassword')}
                                placeholderTextColor="#6a6a6a"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={styles.authInput}
                            />
                            <View style={styles.navForm}>
                                <TouchableOpacity onPress={handlePreviousStep}>
                                    <Octicons name="chevron-left" size={28} color="#6a6a6a" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.continueBtn, { backgroundColor: themeBackgroundColorBtn.backgroundColor }]} onPress={handleNextStep} >
                                    <Text style={[styles.textH3Bold, themeButtonTextColor]}>{i18n.t("auth.continue")}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}

                    {step === 6 && (
                        <View>
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.yourActivities")}</Text>
                            <TextInput
                                placeholder={i18n.t('infoUser.yourActivities')}
                                placeholderTextColor="#6a6a6a"
                                value={activities}
                                onChangeText={setActivities}
                                style={styles.authInput}
                            />
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("infoUser.country")}</Text>

                            {
                                loading ? (
                                    <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                                        <Text> Loading countries...</Text>
                                        <ActivityIndicator size="small" color="black" />
                                    </View>
                                ) : (
                                    <RNPickerSelect
                                        onValueChange={(value) => setCountry(value)}
                                        items={items}
                                        value={country}
                                        style={{
                                            inputIOS: styles.picker,
                                            inputAndroid: styles.picker,
                                            placeholder: {
                                                ...styles.textH3Placeholder, 
                                            },
                                        }}
                                        placeholder={{ label: i18n.t('label.selectCountry'), value: null }}                                    />
                                )
                            }

                            <View style={styles.navForm}>
                                <TouchableOpacity onPress={handlePreviousStep}>
                                    <Octicons name="chevron-left" size={28} color="#6a6a6a" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.authBtn} onPress={handleSignUp}>
                                        <Text style={styles.authBtnText}>{i18n.t("auth.signup")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                </View>

                <View style={styles.authAsk}>

                    
                    <View style={styles.askAccountText} >
                        <Text style={[styles.textH3, themeTextStyle]}>{i18n.t("auth.askAccount")} {" "}</Text>

                        <Link href="/login">
                            <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("auth.signin")}</Text>
                        </Link>

                    </View>
                </View>

            </View>

        </SafeAreaView>
    )
}
