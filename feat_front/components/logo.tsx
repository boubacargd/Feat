import React from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '@/hooks/useTheme';

export default function LogoFeat() {
    const { themeTextStyle, themeContainerStyle, themeBackgroundColorBtn, themeButtonTextColor, themeBorderColor } = useTheme();

    return (
      <View style={{margin:"auto", padding:20, display:"flex", flexDirection:"row", justifyContent:"center", alignSelf:"flex-end"}}>
        <Text style={[{fontSize:40, fontWeight:"bold"}, themeTextStyle]}>featuring</Text>
      </View>
    )
  }

