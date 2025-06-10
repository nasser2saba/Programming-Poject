import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

export default function HerinneringenScreen() {
  const [meds, setMeds] = useState<any[]>([]);
  const [takenStatus, setTakenStatus] = useState<{ [id: number]: boolean }>({});

  const API_URL = 'http://192.168.0.177:4000/api/medications';

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
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Kon medicatie niet ophalen');
    }
  };

  const toggleTaken = (id: number) => {
    setTakenStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderMedItem = ({ item }: { item: any }) => {
    // Determine status color
    let color = '#000'; // default
    if (takenStatus[item.id]) {
      color = 'green';
    } else if (new Date(item.startDate) < new Date()) {
      color = 'red';
    }

    const nextTime = '09:00';

    return (
      <TouchableOpacity
        style={[styles.medCard, { borderColor: color, borderWidth: 2 }]}
        onPress={() => toggleTaken(item.id)}
      >
        <View style={styles.medInfo}>
          <Text style={[styles.medName, { color }]}>{item.naam}</Text>
          <Text style={styles.medDetails}>💊 Dosis: {item.dosis}</Text>
          <Text style={styles.medDetails}>⏰ Volgende inname: {nextTime}</Text>
        </View>
        <Ionicons
          name={takenStatus[item.id] ? 'checkbox' : 'square-outline'}
          size={24}
          color={takenStatus[item.id] ? 'green' : 'black'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 Herinneringen</Text>
      <FlatList
        data={meds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMedItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  medCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  medInfo: {},
  medName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  medDetails: { fontSize: 14, color: '#555' },
});
