import React, { useEffect, useState } from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet, Alert, Platform, ImageBackground, Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://192.168.0.177:4000/api/auth/notification/savePushToken';

export default function ProfileScreen({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    fetchUser();

    if (pushEnabled) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) savePushToken(token);
      });
    }
  }, [pushEnabled]);

  const fetchUser = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return;

    try {
      const res = await axios.get('http://192.168.0.177:4000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('❌ Gebruikersinfo ophalen mislukt:', err);
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Melding', 'Push notificaties zijn niet toegestaan.');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('✅ Expo push token:', token);
    } else {
      Alert.alert('Fout', 'Push notificaties werken alleen op een echt apparaat.');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  };

  const savePushToken = async (token: string) => {
    const jwt = await SecureStore.getItemAsync('token');
    if (!jwt) return;
    try {
      await axios.post(API_URL, { token }, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
    } catch (err) {
      console.error('❌ Fout bij opslaan push token:', err);
    }
  };

  return (
    <ImageBackground source={require('../assets/background2.jpg')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.card}>
          <Image source={require('../assets/profilepicture.jpg')} style={styles.profileImage} />

          <Text style={styles.title}>Welkom terug</Text>
          <Text style={styles.email}>{user?.email ?? '...'}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Push Notificaties</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ true: '#FF66B2', false: '#ccc' }}
              thumbColor={pushEnabled ? '#00BFFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email Herinneringen</Text>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ true: '#FF66B2', false: '#ccc' }}
              thumbColor={emailEnabled ? '#00BFFF' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Uitloggen</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 40,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF66B2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#00BFFF',
  },
  email: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF66B2',
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
