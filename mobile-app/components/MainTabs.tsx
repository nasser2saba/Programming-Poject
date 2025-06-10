import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedicationScreen from '../screens/MedicationScreen';
//import PlaceholderScreen from '../screens/PlaceholderScreen';
import ReminderScreen from '../screens/HerinneringenScreen';
import HistoryScreen from '../screens/HistoriekScreen';
import ProfileScreen from '../screens/ProfielScreen';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Meds" component={MedicationScreen} />
      <Tab.Screen name="Herinneringen" component={ReminderScreen} />
      <Tab.Screen name="Historiek" component={HistoryScreen} />
      <Tab.Screen name="Profiel" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
