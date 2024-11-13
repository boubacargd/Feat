import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      tabBarBackground: () => (
        <LinearGradient
          colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']} // Couleur opaque vers transparente
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{ flex: 1 }}
        />
      ),
    }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => 
            focused
              ? <Ionicons name="home-sharp" size={28} color="black" />
              : <Ionicons name="home-outline" size={28} color="black" />
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color, focused }) => 
            focused
              ? <Ionicons name="chatbubble-sharp" size={28} color="black" />
              : <Ionicons name="chatbubble-outline" size={28} color="black" />
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, focused }) => 
            focused
              ? <Ionicons name="notifications-sharp" size={28} color="black" />
              : <Ionicons name="notifications-outline" size={28} color="black" />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => 
            focused
              ? <Ionicons name="person-sharp" size={28} color="black" />
              : <Ionicons name="person-outline" size={28} color="black" />
        }}
      />
    </Tabs>
  );
}
