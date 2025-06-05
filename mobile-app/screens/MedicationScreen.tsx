import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function MedicationScreen() {
  const [meds, setMeds] = useState([]);
  const [naam, setNaam] = useState('');
  const [dosis, setDosis] = useState('');
  const [frequentie, setFrequentie] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const API_URL = 'http://10.2.88.154:4000/api/medications';

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeds(res.data);
      console.log(res.data);
      
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Kon medicatie niet ophalen');
    }
  };

  const addMed = async () => {
    if (!naam || !dosis || !frequentie || !startDate) {
      return Alert.alert("Fout", "Vul alle verplichte velden in");
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.post(API_URL, {
        naam, dosis, frequentie, startDate, endDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Toegevoegd', 'Medicijn toegevoegd');
      fetchMeds(); // Refresh
      setNaam(''); setDosis(''); setFrequentie(''); setStartDate(''); setEndDate('');
    } catch (err) {
      console.error(err);
      Alert.alert('Fout', 'Toevoegen mislukt');
    }
  };

  const deleteMed = async (id: number) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMeds();
    } catch (err) {
      console.error(err);
      Alert.alert('Fout', 'Verwijderen mislukt');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn Medicatie</Text>

      <FlatList
        data={meds}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <View style={styles.medItem}>
            <Text>{item.naam} - {item.dosis} - {item.frequentie}</Text>
            <Button title="Verwijder" onPress={() => deleteMed(item.id)} />
          </View>
        )}
      />

      <View style={styles.form}>
        <Text style={{ fontWeight: 'bold' }}>Voeg toe:</Text>
        <TextInput placeholder="Naam" style={styles.input} value={naam} onChangeText={setNaam} />
        <TextInput placeholder="Dosis" style={styles.input} value={dosis} onChangeText={setDosis} />
        <TextInput placeholder="Frequentie" style={styles.input} value={frequentie} onChangeText={setFrequentie} />
        <TextInput placeholder="Startdatum (YYYY-MM-DD)" style={styles.input} value={startDate} onChangeText={setStartDate} />
        <TextInput placeholder="Einddatum (optioneel)" style={styles.input} value={endDate} onChangeText={setEndDate} />
        <Button title="Toevoegen" onPress={addMed} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
  medItem: { marginBottom: 10, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 5 },
  form: { marginTop: 20 }
});
