import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


/*
export default function HerinneringenScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Herinneringen</Text>
    </View>
  );
}
  */

export default function ReminderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔔 Herinneringen komen hier binnenkort</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: '500' }
});

