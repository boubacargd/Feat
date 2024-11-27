import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false, 
      }}
    >
      {/* Onglet Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Ionicons name="home-sharp" size={28} color="black" />
            ) : (
              <Ionicons name="home-outline" size={28} color="black" />
            ),
        }}
      />
      {/* Onglet Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <FontAwesome6 name="ranking-star" size={28} color="black" />
            ) : (
              <FontAwesome6 name="ranking-star" size={24} color="black" />
            ),
        }}
      />
      {/* Onglet Messages */}
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Ionicons name="chatbubble-sharp" size={28} color="black" />
            ) : (
              <Ionicons name="chatbubble-outline" size={28} color="black" />
            ),
        }}
      />
      {/* Onglet Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) =>
            focused ? (
              <Ionicons name="person-sharp" size={28} color="black" />
            ) : (
              <Ionicons name="person-outline" size={28} color="black" />
            ),
        }}
      />
    </Tabs>
  );
}
