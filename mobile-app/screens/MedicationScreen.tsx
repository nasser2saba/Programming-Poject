import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MedicationScreen() {
  const [meds, setMeds] = useState([]);
  const [naam, setNaam] = useState('');
  const [dosis, setDosis] = useState('');
  const [frequentie, setFrequentie] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('');

  const API_URL = 'http://192.168.0.177:4000/api/medications';

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeds(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Kon medicatie niet ophalen');
    }
  };

  const addMed = async () => {
    if (!naam || !dosis || !frequentie || !startDate || !time) {
      return Alert.alert('Fout', 'Vul alle verplichte velden in');
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.post(
        API_URL,
        { naam, dosis, frequentie, startDate, endDate, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Toegevoegd', 'Medicijn toegevoegd');
      fetchMeds();
      setNaam('');
      setDosis('');
      setFrequentie('');
      setStartDate('');
      setEndDate('');
      setTime('');
    } catch (err) {
      console.error(err);
      Alert.alert('Fout', 'Toevoegen mislukt');
    }
  };

  const deleteMed = async (id: number) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMeds();
    } catch (err) {
      console.error(err);
      Alert.alert('Fout', 'Verwijderen mislukt');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>💊 Mijn Medicatie</Text>

        <FlatList
          data={meds}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }: any) => (
            <View style={styles.medCard}>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{item.naam}</Text>
                <Text style={styles.medDetails}>💊 Dosis: {item.dosis}</Text>
                <Text style={styles.medDetails}>⏰ Frequentie: {item.frequentie}</Text>
                <Text style={styles.medDetails}>🕒 Tijd: {item.time ?? 'Niet gespecificeerd'}</Text>
                <Text style={styles.medDetails}>📅 Start: {item.startDate}</Text>
                <Text style={styles.medDetails}>
                  📅 Eind: {item.endDate ? item.endDate : '-'}
                </Text>
              </View>
              <Button
                title="🗑️ Verwijder"
                color="#e91e63"
                onPress={() => deleteMed(item.id)}
              />
            </View>
          )}
        />

        <View style={styles.form}>
          <Text style={styles.formTitle}>➕ Voeg medicatie toe</Text>
          <TextInput placeholder="Naam" style={styles.input} value={naam} onChangeText={setNaam} />
          <TextInput placeholder="Dosis" style={styles.input} value={dosis} onChangeText={setDosis} />
          <TextInput placeholder="Frequentie" style={styles.input} value={frequentie} onChangeText={setFrequentie} />
          <TextInput placeholder="Startdatum (YYYY-MM-DD)" style={styles.input} value={startDate} onChangeText={setStartDate} />
          <TextInput placeholder="Einddatum (optioneel)" style={styles.input} value={endDate} onChangeText={setEndDate} />
          <TextInput placeholder="Tijd (HH:mm)" style={styles.input} value={time} onChangeText={setTime} />
          <View style={styles.addButton}>
            <Button title="Toevoegen" color="#2196f3" onPress={addMed} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0f0f0f',
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  medCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  medInfo: { marginBottom: 10 },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2196f3',
  },
  medDetails: { fontSize: 14, color: '#555' },
  form: { marginTop: 20 },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0d47a1',
  },
  addButton: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
