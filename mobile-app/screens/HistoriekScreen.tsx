import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


/*
export default function HerinneringenScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Historiek</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const [logs] = useState([
    { id: '1', naam: 'Paracetamol', status: 'voltooid', datum: '2025-05-17' },
    { id: '2', naam: 'Ibuprofen', status: 'gemist', datum: '2025-05-16' },
    { id: '3', naam: 'Amoxicilline', status: 'voltooid', datum: '2025-05-15' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inname Historiek</Text>
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>{item.datum} - {item.naam}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  logItem: { backgroundColor: '#eee', padding: 10, marginVertical: 5, borderRadius: 5 }
});
*/

type Marking = {
  dots?: { color: string }[];
  selected?: boolean;
  selectedColor?: string;
  marked?: boolean;
};

type MarkedDates = {
  [date: string]: Marking;
};

type ReminderLog = {
  timestamp: string;
  status: 'voltooid' | 'gemist';
  Medication?: {
    naam: string;
  };
};

export default function HistoryScreen() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<string>('');
const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  

  useEffect(() => {
    fetchLogs();
  }, []);


  const fetchLogs = async () => {
    const token = await SecureStore.getItemAsync('token');
    console.log(token)
    try {
      const res = await axios.get('http://10.2.88.154:4000/api/reminders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const logs = res.data;
      setLogs(logs);

      // Build calendar marks
      const marks: any = {};
      logs.forEach((log: any) => {
        const date = log.timestamp.split('T')[0]; // e.g. '2025-05-18'
        const color = log.status === 'voltooid' ? 'green' : 'red';

        if (!marks[date]) {
          marks[date] = { dots: [{ color }] };
        } else {
          marks[date].dots.push({ color });
        }
      });

      // Tell calendar to show dots
      Object.keys(marks).forEach((d) => {
        marks[d].marked = true;
      });

      setMarkedDates(marks);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter logs for selected day
  const filteredLogs: ReminderLog[] = selectedDate
  ? logs.filter((l) => l.timestamp.startsWith(selectedDate))
  : [];



    
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Calendar
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || { dots: [] }),
            selected: true,
            selectedColor: '#00adf5',
          },
        }}
        markingType="multi-dot"
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <Text style={styles.heading}>
        {selectedDate ? `Logs for ${selectedDate}` : 'Kies een dag'}
      </Text>

      <FlatList
        data={filteredLogs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 4 }}>
            {item.Medication?.naam ?? 'Onbekend'} – {item.status.toUpperCase()}
          </Text>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
});

