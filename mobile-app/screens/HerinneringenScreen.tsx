import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

export default function HerinneringenScreen() {
  const [medsByDate, setMedsByDate] = useState<any>({});
  const [takenStatus, setTakenStatus] = useState<{ [id: number]: boolean }>({});

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

      const today = new Date();

      const grouped: any = {
        vandaag: [],
      };

      for (const med of res.data) {
        //console.log(med);
        const start = new Date(med.startDate);
        const end = med.endDate ? new Date(med.endDate) : null;

        // Schedule notifications
        if (med.time) {
          const [hourStr, minuteStr] = med.time.split(':');
          const hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: '💊 Herinnering',
              body: `Neem je medicijn: ${med.naam}`,
              sound: true,
            },
            trigger: {
              hour,
              minute,
              repeats: true,
            } as Notifications.CalendarTriggerInput,
          });
        }

        // Group medication
       //console.log(start);
       // console.log(today.getDate);
        if (start.getDate() <= today.getDate() && (!end || today.getDate <= end.getDate)) {
          console.log("vandaag" + med );
          grouped.vandaag.push(med);
        }
      }

      setMedsByDate(grouped);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Kon medicatie niet ophalen');
    }
  };

  const toggleTaken = async (id: number) => {
    const newStatus = takenStatus[id] ? 'gemist' : 'voltooid';
    setTakenStatus((prev) => ({ ...prev, [id]: !prev[id] }));

    const token = await SecureStore.getItemAsync('token');
    /*try {
      await axios.patch(
        `http://10.2.89.207:4000/api/reminders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Fout', 'Status updaten mislukt');
    }*/
  };

  const renderMedItem = ({ item }: { item: any }) => {
    const nextTime = item.time ?? 'Onbekend';
    const isTaken = takenStatus[item.id];

    return (
      <TouchableOpacity
        style={[styles.medCard, { borderColor: isTaken ? 'green' : '#ccc' }]}
        onPress={() => toggleTaken(item.id)}
      >
        <View style={styles.medInfo}>
          <Text style={[styles.medName, isTaken && styles.strikethrough]}>
            {item.naam}
          </Text>
          <Text style={styles.medDetails}>💊 Dosis: {item.dosis}</Text>
          <Text style={styles.medDetails}>🕒 Tijd: {nextTime}</Text>
        </View>
        <Ionicons
          name={isTaken ? 'checkbox' : 'square-outline'}
          size={26}
          color={isTaken ? '#4CAF50' : '#0077cc'}
        />
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, data: any[]) => (
    <View>
      <Text style={styles.sectionHeader}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.noMed}>Geen medicatie</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMedItem}
        />
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>💊 Herinneringen</Text>
        {renderSection('Vandaag', medsByDate.vandaag || [])}
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0f0f0f',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#0f0f0f',
  },
  noMed: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 10,
  },
  medCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#ffffffcc',
    borderRadius: 12,
    borderWidth: 2,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077cc',
    marginBottom: 4,
  },
  medDetails: {
    fontSize: 14,
    color: '#555',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
});
