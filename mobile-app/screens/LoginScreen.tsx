import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://192.168.0.177:4000/api/auth/login', {
        email,
        password,
      });

      // ⚠️ Save token if needed
      console.log('✅ Login successful test, token:', );

      await SecureStore.setItemAsync('token', res.data.token);
      console.log(res.data.token);

      Alert.alert("Success", "Ingelogd!");
      navigation.replace('Home'); // or main app tabs later
    } catch (err: any) {
      console.error(err);
      Alert.alert("Fout", "Login mislukt");
    }
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welkom terug 👋</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Inloggen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Nog geen account? Registreer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#00aaff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#2c3e50',
    textDecorationLine: 'underline',
  },
});
