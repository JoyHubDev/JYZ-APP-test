import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import semua screen
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ForYouScreen from './src/screens/ForYouScreen';
import MyListScreen from './src/screens/MyListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminPanel from './src/screens/AdminPanel';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Untukmu" component={ForYouScreen} />
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Daftar Saya" component={MyListScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      {isAdmin && <Stack.Screen name="AdminPanel" component={AdminPanel} />}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
    }
