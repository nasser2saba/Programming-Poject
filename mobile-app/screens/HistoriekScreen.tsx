import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  id: number;
  timestamp: string;
  status: 'voltooid' | 'gemist';
  medication_id: number;
  Medication?: {
    naam: string;
  };
};

export default function HistoryScreen() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [meds, setMeds] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    fetchLogsAndMeds();
  }, []);

  const fetchLogsAndMeds = async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const remindersRes = await axios.get('http://192.168.0.177:4000/api/reminders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedLogs = remindersRes.data;
      setLogs(fetchedLogs);

      const medsRes = await axios.get('http://192.168.0.177:4000/api/medications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedMeds = medsRes.data;
      setMeds(fetchedMeds);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const marks: any = {};

      fetchedLogs.forEach((log: any) => {
        const date = log.timestamp.split('T')[0];
        const color = log.status === 'voltooid' ? 'green' : 'red';
        if (!marks[date]) marks[date] = { dots: [{ color }] };
        else marks[date].dots.push({ color });
      });

      fetchedMeds.forEach((med: any) => {
        const start = new Date(med.startDate);
        const end = med.endDate ? new Date(med.endDate) : null;
        let current = new Date(start);

        while (!end || current <= end) {
          const dateStr = current.toISOString().split('T')[0];

          if (current > today) {
            const alreadyLogged = fetchedLogs.some(
              (l: any) => l.medication_id === med.id && l.timestamp.startsWith(dateStr)
            );
            if (!alreadyLogged) {
              if (!marks[dateStr]) marks[dateStr] = { dots: [{ color: 'blue' }] };
              else marks[dateStr].dots.push({ color: 'blue' });
            }
          }
          current.setDate(current.getDate() + 1);
        }
      });

      Object.keys(marks).forEach((d) => {
        marks[d].marked = true;
      });

      setMarkedDates(marks);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems: any[] = [];
  if (selectedDate) {
    const logsForDay = logs.filter((l) => l.timestamp.startsWith(selectedDate));
    filteredItems.push(...logsForDay);

    const selected = new Date(selectedDate);
selected.setHours(0, 0, 0, 0); // strip time

meds.forEach((med) => {
  const start = new Date(med.startDate);
  const end = med.endDate ? new Date(med.endDate) : null;

  start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);

  const isPlanned =
    selected >= start &&
    (!end || selected <= end) &&
    !logsForDay.some((l) => l.medication_id === med.id);

  if (isPlanned) {
    filteredItems.push({
      id: med.id,
      status: 'gepland',
      Medication: { naam: med.naam },
      dosis: med.dosis,
      tijd: med.time,
    });
  }
});
  }

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
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
          {selectedDate ? `Logs voor ${selectedDate}` : 'Kies een dag'}
        </Text>

        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={({ item }) => {
            let bgColor = '#f0f0f0';
            let textColor = '#555';
            let statusText = '';

            if (item.status === 'voltooid') {
              bgColor = '#d4edda';
              textColor = '#155724';
              statusText = 'VOLTOOID';
            } else if (item.status === 'gemist') {
              bgColor = '#f8d7da';
              textColor = '#721c24';
              statusText = 'GEMIST';
            } else if (item.status === 'gepland') {
              bgColor = '#dbe9f4';
              textColor = '#0d3c61';
              statusText = 'GEPLAND';
            }

            return (
              <View style={[styles.logItem, { backgroundColor: bgColor }]}>
                <Text style={[styles.logText, { color: textColor }]}>
                  {item.Medication?.naam ?? 'Onbekend'}
                </Text>
                {item.dosis && (
                  <Text style={[styles.logText, { color: textColor }]}>
                    💊 Dosis: {item.dosis}
                  </Text>
                )}
                {item.tijd && (
                  <Text style={[styles.logText, { color: textColor }]}>
                    🕒 Tijd: {item.tijd}
                  </Text>
                )}
                <Text style={[styles.logText, { color: textColor }]}>
                  Status: {statusText}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Geen logs of geplande medicatie voor deze dag
            </Text>
          }
        />
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logItem: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  logText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
