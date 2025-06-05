import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MedicationScreen from './screens/MedicationScreen';
import HerinneringenScreen from './screens/HerinneringenScreen';
import HistoriekScreen from './screens/HistoriekScreen';
import ProfielScreen from './screens/ProfielScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ask for push permission & get Expo token
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}

// Bottom Tab Navigation (after login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Meds':
              iconName = 'medkit';
              break;
            case 'Herinneringen':
              iconName = 'notifications';
              break;
            case 'Historiek':
              iconName = 'calendar';
              break;
            case 'Profiel':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Meds" component={MedicationScreen} />
      <Tab.Screen name="Herinneringen" component={HerinneringenScreen} />
      <Tab.Screen name="Historiek" component={HistoriekScreen} />
      <Tab.Screen name="Profiel" component={ProfielScreen} />
    </Tab.Navigator>
  );
}

// Main App
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Expo Push Token:', token);
        // 🟡 TODO: Send token to backend to save in User table
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
