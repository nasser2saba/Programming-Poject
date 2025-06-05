import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://10.2.88.154:4000/api/auth/login', {
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
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Wachtwoord:</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Nog geen account? Registreer" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 5 }
});
