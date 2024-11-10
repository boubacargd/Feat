import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import useStyles from '../../styles/styleSheet'

export default function App() {
  const styles = useStyles();
  const { colorScheme, themeTextStyle, themeContainerStyle } = useTheme(); 

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.text, themeTextStyle]}>Color scheme: {colorScheme}</Text>
      <StatusBar />
    </View>
  );
}


