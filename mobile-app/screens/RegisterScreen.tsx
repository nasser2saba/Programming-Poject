import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }: any) {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://10.2.88.154:4000/api/auth/register', {
        naam,
        email,
        password,
      });

      Alert.alert("Gelukt", "Registratie voltooid");
      navigation.navigate('Login');
    } catch (err: any) {
      console.error(err);
      Alert.alert("Fout", "Registratie mislukt");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Naam:</Text>
      <TextInput style={styles.input} value={naam} onChangeText={setNaam} />
      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Wachtwoord:</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Registreer" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 5 }
});
