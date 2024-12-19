import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import CountryFlag from 'react-native-country-flag';  
import { getCode } from 'country-list'; 

const { width } = Dimensions.get("window");

interface UserActivitiesCountryProps {
    country: string; 
    activities: string;
}

export default function UserActivitiesCountry({ country, activities }: UserActivitiesCountryProps) {

    const countryCode = getCode(country); 

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
            <Text style={{ fontSize: 12, color: "white", fontWeight: 700 }}>
                {activities || ''},{" "}{country || ''}
            </Text>
            {countryCode && (
                <CountryFlag isoCode={countryCode} size={10} style={{ marginLeft: 5 }} />
            )}
        </View>
    );
}
