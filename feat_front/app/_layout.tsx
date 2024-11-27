import React from 'react';
import { Stack } from 'expo-router';

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
                name="(auth)/(register)/addImageProfile"
                options={{
                    headerShown: false,
                    headerTitle: "Add Image Profile",
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
                name="profile"
                options={{
                    headerShown: false,
                    headerTitle: "Profile",
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
