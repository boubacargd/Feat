import React from 'react';
import { View, Text, Image } from 'react-native';
import useStyles from '../../styles/styleSheet';
import { useTheme } from '@/hooks/useTheme';
interface UserInfoProps {
    name: string;
    country: string;
    activities: string;
    imageUrl: string;
    themeTextStyle: object;
}

export default function UserInfo({ name, country, activities, imageUrl }: UserInfoProps) {
    const styles = useStyles();
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();

    return (
        <View style={[styles.containerUserInfo, themeContainerStyle]}>
            <Image
                source={{ uri: imageUrl }}
                style={{
                    width: 125,
                    height: 125,
                    borderRadius: 15,
                }}
                onError={() => {
                    // Gestion des erreurs d'image ici
                }}
            />
            <View style={{ padding: 20 }}>
                <Text style={[styles.textH1Bold, themeTextStyle]}>{name}</Text>
                <Text style={[styles.textH3, themeTextStyle]}>{activities || ''}</Text>
                <Text style={[styles.textH3, themeTextStyle]}>{country || ''}</Text>
            </View>
        </View>
    );
}
