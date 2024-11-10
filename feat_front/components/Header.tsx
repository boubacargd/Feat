import React from 'react';
import { View, Text } from 'react-native';
import useStyles from "../styles/styleSheet"

export default function CustomHeader() {

  const styles = useStyles();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Header</Text>
    </View>
  )
};

