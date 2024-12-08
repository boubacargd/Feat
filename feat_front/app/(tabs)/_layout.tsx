import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import { Dimensions, View } from 'react-native';

export default function TabLayout() {
  const { width } = Dimensions.get("window");

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: 60, // Ajuste la hauteur de la tabBar si nécessaire
          width: width,
          backgroundColor: 'black', // Assure-toi que la couleur de fond soit transparente
          borderTopWidth: 0, // Supprime la bordure supérieure
        },
     
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Ionicons name="home-sharp" size={24} color="white" />
            ) : (
              <Ionicons name="home-outline" size={24} color="white" />
            ),
            headerShown: false,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <FontAwesome5 name="bars" size={24} color="white" />
            ) : (
              <Octicons name="three-bars" size={24} color="white" />
            ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Ionicons name="chatbubble-sharp" size={24} color="white" />
            ) : (
              <Ionicons name="chatbubble-outline" size={24} color="white" />
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Ionicons name="person-sharp" size={24} color="white" />
            ) : (
              <Ionicons name="person-outline" size={24} color="white" />
            ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
