import React, { useState } from 'react'
import { SafeAreaView, Text, View, TextInput, TouchableOpacity } from 'react-native'
import useStyles from '../../styles/styleSheet'
import { useTheme } from '../../hooks/useTheme';
import i18n from '../i18n';
import { Link } from 'expo-router';
import LogoFeat from '@/components/logo';

export default function login() {
    const styles = useStyles();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                        <Link href="/(tabs)/home">
                            <Text style={styles.authBtnText}>{i18n.t("auth.signin")}</Text>
                        </Link>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={styles.authAsk}>

                <View style={styles.askAccountText} >
                    <Text style={[styles.textH3, themeTextStyle]}>{i18n.t("auth.askRegistration")} {" "}</Text>

                    <Link href="/register">
                        <Text style={[styles.textH3Bold, themeTextStyle]}>{i18n.t("auth.signup")}</Text>
                    </Link>

                </View>
            </View>
        </SafeAreaView>
    )
}

