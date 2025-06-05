import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';

//export default function ProfielScreen() {
//  return (
//    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//      <Text>Profiel</Text>
//    </View>
//  );
//}

export default function ProfileScreen({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiel</Text>

      <Text>Email: gebruiker@example.com</Text>

      <View style={styles.row}>
        <Text>Push Notificaties</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} />
      </View>

      <View style={styles.row}>
        <Text>Email Herinneringen</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>

      <Button title="Uitloggen" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
});

