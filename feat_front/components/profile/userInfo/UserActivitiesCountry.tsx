import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import CountryFlag from 'react-native-country-flag';  // Importer la bibliothèque
import { getCode } from 'country-list'; // Importer la fonction de conversion

const { width } = Dimensions.get("window");

interface UserActivitiesCountryProps {
    country: string;  // Le nom complet du pays, par exemple 'France'
    activities: string;
}

export default function UserActivitiesCountry({ country, activities }: UserActivitiesCountryProps) {
    // Conversion du nom du pays en code ISO
    const countryCode = getCode(country);  // Cela renvoie le code ISO à deux lettres, ou undefined si le pays est introuvable

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
            {/* Affichage du texte des activités et du pays */}
            <Text style={{ fontSize: 12, color: "white", fontWeight: 700 }}>
                {activities || ''},{" "}{country || ''}
            </Text>
            {countryCode && (
                <CountryFlag isoCode={countryCode} size={10} style={{ marginLeft: 5 }} />
            )}
        </View>
    );
}
