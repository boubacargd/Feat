import React from 'react';
import { Stack } from 'expo-router';
import CustomHeader from '../components/Header';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerTitleStyle: {
                    fontSize: 20,
                },
            }}
        >
            <Stack.Screen 
                name="index" 
                options={{
                    headerTitle: "Accueil", 
                }} 
            />

            <Stack.Screen
                name="(auth)/(register)/register"
                options={{
                    headerShown: false, 
                    headerTitle: "Inscription", 
                }}
            />
            <Stack.Screen
                name="(auth)/login"
                options={{
                    headerShown: false, 
                    headerTitle: "Login", 
                }}
            />

            <Stack.Screen 
                name="(tabs)" 
                options={{ 
                    headerShown: false 
                }} 
            />
        </Stack>
    );
}
