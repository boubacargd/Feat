import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import useStyles from '../../styles/styleSheet';
import axios from 'axios';

export default function App() {
  const styles = useStyles();
  const { colorScheme, themeTextStyle, themeContainerStyle } = useTheme();

  
    return (
      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.textH3Bold, themeTextStyle]}></Text>

      </View>
    );

}


