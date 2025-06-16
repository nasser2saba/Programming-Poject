# Front End - React Native App 

## Step 1: Start the React Native App (basic UI first)

You'll build a **simple frontend** to interact with the backend you made. Since you're using Expo, you can develop quickly without Android/iOS emulators.

Start with just **authentication + medication list**.

### 1A. Start Expo in the mobile folder:

In `/mobile-app`, run:

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

### 1B. Setup screens

we'll need **4 tabs** with minimal functionality (like wireframes mention):

| Tab       | Features                                                 |
| --------- | -------------------------------------------------------- |
| Meds      | Show medications + add/edit/delete                       |
| Herinner. | Dummy screen for now (we'll add notifications later)     |
| Historiek | Dummy screen for now                                     |
| Profiel   | Show user email + logout (and later: notification prefs) |

---

### 1C. Install required packages in mobile app

Run:

```bash
npm install axios react-navigation react-navigation/native react-native-screens react-native-safe-area-context @react-navigation/native-stack @react-navigation/bottom-tabs
```

Also install peer dependencies required by React Navigation (Expo gives instructions after install).

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons react-native-pager-view
```


### 1D. Setup navigation (`App.tsx`):

Set up a simple tab navigator with 4 tabs.


1. Install React Navigation packages

Run these in `/mobile-app`:

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
```

Then install peer dependencies via Expo (if prompted):

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

> **Important**: Add this line at the top of `index.ts`:

```ts
import 'react-native-gesture-handler';
```

---

2. Create screen files

In `/mobile-app`, create a folder `screens`:

```bash
mkdir screens
```

Then create these 4 files:

```bash
touch screens/MedsScreen.tsx
touch screens/HerinneringenScreen.tsx
touch screens/HistoriekScreen.tsx
touch screens/ProfielScreen.tsx
```

Add simple placeholder components in each:

`screens/MedsScreen.tsx`

```tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function MedsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Medicatie Overzicht</Text>
    </View>
  );
}
```

Do the same for the others, just change the `<Text>`:

* `HerinneringenScreen` → "Herinneringen"
* `HistoriekScreen` → "Historiek"
* `ProfielScreen` → "Profiel"


3. Set up Tab Navigator in `App.tsx`

Replace the content of `App.tsx` with this:

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedsScreen from './screens/MedsScreen';
import HerinneringenScreen from './screens/HerinneringenScreen';
import HistoriekScreen from './screens/HistoriekScreen';
import ProfielScreen from './screens/ProfielScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Meds':
                iconName = 'medkit';
                break;
              case 'Herinneringen':
                iconName = 'notifications';
                break;
              case 'Historiek':
                iconName = 'calendar';
                break;
              case 'Profiel':
                iconName = 'person';
                break;
              default:
                iconName = 'ellipse';
            }

              return <Ionicons name={iconName as any} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Meds" component={MedsScreen} />
        <Tab.Screen name="Herinneringen" component={HerinneringenScreen} />
        <Tab.Screen name="Historiek" component={HistoriekScreen} />
        <Tab.Screen name="Profiel" component={ProfielScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

> This creates a bottom tab navigator with 4 screens.

---

### Optional: Add Icons (make it pretty)

Install icon lib:

```bash
npm install @expo/vector-icons
```

Then modify `Tab.Navigator` like this:

```tsx
<Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarIcon: ({ color, size }) => {
      let iconName: string;

      switch (route.name) {
        case 'Meds':
          iconName = 'medkit';
          break;
        case 'Herinneringen':
          iconName = 'notifications';
          break;
        case 'Historiek':
          iconName = 'calendar';
          break;
        case 'Profiel':
          iconName = 'person';
          break;
        default:
          iconName = 'ellipse';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
>
```

Don’t forget to import icons:

```tsx
import { Ionicons } from '@expo/vector-icons';
```

---

### Now run the app:

```bash
npx expo start
```

Scan with **Expo Go** on your phone — you should now see the bottom tab bar with 4 working screens.


## **Step 2: Connect Login/Register**

- Set up login/register screens and call your backend endpoints.
- Use `axios.post("http://<your-ip>:4000/api/auth/login", {...})`.

> ⚠️ Replace `<your-ip>` with your local IP (e.g. `192.168.1.10`) so Expo Go can talk to backend.


first: download what's needed in mobile-app folder: 

```bash
npm install axios
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

**SETUP**: Navigation in `App.tsx`

Replace the content of your `App.tsx` with this basic structure:

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MedsScreen from './screens/MedsScreen';
import HerinneringenScreen from './screens/HerinneringenScreen';
import HistoriekScreen from './screens/HistoriekScreen';
import ProfielScreen from './screens/ProfielScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 👇 Tab navigation (after login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Meds':
              iconName = 'medkit';
              break;
            case 'Herinneringen':
              iconName = 'notifications';
              break;
            case 'Historiek':
              iconName = 'calendar';
              break;
            case 'Profiel':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Meds" component={MedsScreen} />
      <Tab.Screen name="Herinneringen" component={HerinneringenScreen} />
      <Tab.Screen name="Historiek" component={HistoriekScreen} />
      <Tab.Screen name="Profiel" component={ProfielScreen} />
    </Tab.Navigator>
  );
}

// 👇 Main app with login flow
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MainTabs} /> {/* 👈 load tabs after login */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

**CREATE** `/screens/LoginScreen.tsx`

Create a new folder `screens/` and add `LoginScreen.tsx` inside:

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://YOUR_LOCAL_IP:4000/api/auth/login', {
        email,
        password,
      });

      // ⚠️ Save token if needed
      console.log('✅ Login successful, token:', res.data.token);

      Alert.alert("Success", "Ingelogd!");
      navigation.navigate('Home'); // or main app tabs later
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
```

---

**CREATE** `/screens/RegisterScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }: any) {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://YOUR_LOCAL_IP:4000/api/auth/register', {
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
```

---

**CREATE** `/screens/HomeScreen.tsx`

Just something simple for now:

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welkom in de Medicatie App!</Text>
      <Button title="Logout" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
```

---

**IMPORTANT**: Use your **local IP** address for requests

To allow your phone (Expo Go) to connect to your backend, replace this in RegiterScreen.tsx and LoginScreen.tsx:

```ts
http://YOUR_LOCAL_IP:4000/api/...
```

with your actual IP (on Windows, run in PowerShell):

```bash
ipconfig
```

Look for **IPv4 Address**, e.g. `192.168.1.23`.

---

**TEST**

1. Run your backend:

```bash
cd backend
node server.js
```

2. Start Expo app:

```bash
cd mobile-app
npx expo start
```

3. Open Expo Go on your phone → Scan QR code

4. Try registering and logging in. Check Postman/backend logs.




You now have:

* Login screen
* Register screen
* Home screen
* Navigation working
* Calls to backend via `axios`




## **Step 3: Show Medication List**

After login:

* Save the JWT token
* Use it in requests with `Authorization: Bearer <token>`
* Fetch `/api/medications` and display them
* Add a simple form with name, dosis, frequentie
* Include "Add", "Edit", "Delete" functionality

Let the user:

1. ✅ View their medications
2. ➕ Add a new medication
3. ✏️ Edit an existing medication
4. ❌ Delete a medication

All this via a **simple list view**.

### 1. Create `MedicationScreen.tsx` inside `/screens`

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function MedicationScreen({ navigation }: any) {
  const [token, setToken] = useState<string | null>(null); // In real app, get from secure storage
  const [meds, setMeds] = useState([]);
  const [naam, setNaam] = useState('');
  const [dosis, setDosis] = useState('');
  const [frequentie, setFrequentie] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const API_URL = 'http://YOUR_LOCAL_IP:4000/api/medications';

  useEffect(() => {
    // For now, hardcode the token (get from login response in dev)
    const hardcodedToken = 'your-jwt-token-from-login'; // Replace with your real token
    setToken(hardcodedToken);
  }, []);

  useEffect(() => {
    if (token) fetchMeds();
  }, [token]);

  const fetchMeds = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeds(res.data);
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
```

---

### 2. Add this screen to your navigation

**Create** file `/components/MainTabs.tsx`

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedicationScreen from '../screens/MedicationScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Meds" component={MedicationScreen} />
      <Tab.Screen name="Herinneringen" component={PlaceholderScreen} />
      <Tab.Screen name="Historiek" component={PlaceholderScreen} />
      <Tab.Screen name="Profiel" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}
```

---

**Create** a temporary placeholder screen `/screens/PlaceholderScreen.tsx`

```tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function PlaceholderScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Work in progress...</Text>
    </View>
  );
}
```

Now finishing the rest:

**STEP 1:** PROFIELPAGINA (Voorkeuren + Uitloggen)

What it needs:

* Show user email (fake/hardcoded is fine)
* Let user choose:

  * Push notificaties AAN/UIT
  * E-mail notificaties AAN/UIT
* Uitloggen knop

**Create**: `/screens/ProfileScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';

export default function ProfileScreen({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiel</Text>

      <Text>Email: gebruiker@example.com</Text> {/* later: replace with real user */}

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
```

**STEP 2:** HISTORIEK + KALENDER

What it needs:

* Show a list of taken or missed medication logs
* Just fake data for now to simulate

**Create**: `/screens/HistoryScreen.tsx`

```tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

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
```

---

**STEP 3:** HERINNERINGEN SCHERM

We’ll make a dummy screen for now that just says “Herinneringen komen hier”.

**Create**: `/screens/ReminderScreen.tsx`

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
```



**Update** `MainTabs.tsx`

Now replace your `MainTabs.tsx` to load the real screens:

```tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedicationScreen from '../screens/MedicationScreen';
import ReminderScreen from '../screens/ReminderScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Meds" component={MedicationScreen} />
      <Tab.Screen name="Herinneringen" component={ReminderScreen} />
      <Tab.Screen name="Historiek" component={HistoryScreen} />
      <Tab.Screen name="Profiel" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```


## Step 3: Add Notifications 

1. Configure Expo push notifications in the app
2. Save push token in your backend (`User` model)
3. Send test notification from your Node.js server


**PART A:** Setup Push Notifications in App

### 1️⃣ Install package

In `/mobile-app` folder:

```bash
npx expo install expo-notifications
```

### 2️⃣ Configure permissions & listener

Create file: `/utils/notifications.ts`

```tsx
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Push notificaties werken alleen op fysieke telefoons');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Toestemming voor notificaties geweigerd');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

// Handle how notifications behave when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
```

---

### 3️⃣ Call this function in `App.tsx` or `ProfileScreen.tsx`

```tsx
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from './utils/notifications';

useEffect(() => {
  registerForPushNotificationsAsync().then(token => {
    console.log('Expo Push Token:', token);
    // TODO: send token to backend and store in User model
  });
}, []);
```

---

**PART B:** Add `pushToken` field to `User` model

In `/backend/src/models/user.js`:

```js
pushToken: {
  type: DataTypes.STRING,
  allowNull: true,
},
```

Then in terminal, re-sync DB if needed:

```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

Or just drop and recreate table manually if you're in dev.

---

**PART C:** Create API route to save push token

Add to `authController.js`:

```js
exports.savePushToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Geen token meegegeven' });

  try {
    req.user.pushToken = token;
    await req.user.save();
    res.json({ message: 'Token opgeslagen' });
  } catch (err) {
    res.status(500).json({ error: 'Opslaan mislukt' });
  }
};
```

In `/routes/auth.js`:

```js
router.post('/save-push-token', authMiddleware, authController.savePushToken);
```

---

**PART D:** Send push notification from backend

Install in `/backend`:

```bash
npm install expo-server-sdk

```

Then in a new file: `/src/utils/push.js`:

```js
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

exports.sendPush = async (pushToken, title, body) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('❌ Ongeldig token', pushToken);
    return;
  }

  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
  };

  try {
    let ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('✅ Push sent:', ticket);
  } catch (err) {
    console.error('❌ Push failed:', err);
  }
};
```

Then from any controller (for testing):

```js
const { sendPush } = require('../utils/push');

// In test route:
sendPush(user.pushToken, 'Herinnering', 'Neem je medicatie in!');
```


You can now:

* Register a device and save its push token
* Send test push messages from your backend


**NEXT**: Email Herinneringen 


## STEP 4: E-MAIL HERINNERINGEN MET NODEMAILER


**PART A:** Setup NodeMailer

1. Install NodeMailer in your `/backend` folder:

```bash
npm install nodemailer
```

---

2. Create utility: `/src/utils/email.js`

```js
const nodemailer = require('nodemailer');

// Transporter opzetten (gebruik je eigen e-mailadres!)
const transporter = nodemailer.createTransport({
  service: 'gmail', // gebruik bijv. Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendReminderEmail = async (toEmail, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Medicatie App" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      text: text,
    });
    console.log('✅ Email verzonden naar', toEmail);
  } catch (err) {
    console.error('❌ Email verzenden mislukt:', err);
  }
};
```

---

3. Add credentials to your `.env` file:

```env
EMAIL_USER=jouremail@gmail.com
EMAIL_PASS=jouwwachtwoordofappcode
```

> ⚠️ Als je Gmail gebruikt, moet je **2-stapsverificatie aanzetten** en een **App Password** gebruiken. Geen gewoon wachtwoord!
dus ga naar je google account, zet 2Stepverification on, ga naar App password en dan neem de wachtwoord e zet het in de .env bestand 

---

**PART B:** Maak een API om een herinneringsmail te sturen

1. In `/src/controllers/notificationController.js`:

```js
const { sendReminderEmail } = require('../utils/email');
const { sendPush } = require('../utils/push');

exports.sendTestEmail = async (req, res) => {
  try {
    const user = req.user;
    await sendReminderEmail(
      user.email,
      'Medicatie Herinnering',
      'Vergeet je medicatie niet in te nemen!'
    );
    res.json({ message: 'Email verzonden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email verzenden mislukt' });
  }
};

exports.sendTestPush = async (req, res) => {
  try {
    const user = req.user;

    if (!user.pushToken) {
      return res.status(400).json({ error: 'Geen push token aanwezig' });
    }

    await sendPush(user.pushToken, 'Herinnering', 'Neem je medicatie in!');
    res.json({ message: 'Push verzonden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Push verzenden mislukt' });
  }
};

```

---

2. In `/src/routes/notification.js`:

```js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendTestEmail, sendTestPush } = require('../controllers/notificationController');

router.post('/send-test-email', authMiddleware, sendTestEmail);
router.post('/send-test-push', authMiddleware, sendTestPush); // deze toevoegen

module.exports = router;


```

---

3. Voeg de nieuwe route toe in `server.js`:

```js
const notificationRoutes = require('./src/routes/notification');
app.use('/api/notifications', notificationRoutes);
```

---

**PART C:** Testen

1. Start je backend:

```bash
node server.js
```

2. In Postman:

* POST naar: `http://localhost:4000/api/notifications/send-test-email`
* Headers:

  * `Authorization: Bearer <jouw JWT token>`
* Body: *geen nodig*

→ Als alles klopt, krijg je: `Email verzonden`
→ En je ziet de email in je inbox!


DONE: E-mail notificaties werken!

Absolutely! Let’s dive into **Steps 4, 5, and 6** in detail — these will complete your MVP and prepare your app for presentation.

---

## STEP 5: Notifications (Push + Email)

**Goal:** Send reminders to users at specific times.

---

**A**. Push Notificaties via Firebase (FCM) + Expo

Expo has built-in support for push notifications using **FCM under the hood**, so you don't need to manually use the Firebase SDK in the frontend.

#### 1. In your mobile app:

Install notifications support:

```bash
npx expo install expo-notifications
```

Then in `App.tsx`, ask for permission & get the device token:

```tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MedsScreen from './screens/MedsScreen';
import HerinneringenScreen from './screens/HerinneringenScreen';
import HistoriekScreen from './screens/HistoriekScreen';
import ProfielScreen from './screens/ProfielScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ask for push permission & get Expo token
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}

// Bottom Tab Navigation (after login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Meds':
              iconName = 'medkit';
              break;
            case 'Herinneringen':
              iconName = 'notifications';
              break;
            case 'Historiek':
              iconName = 'calendar';
              break;
            case 'Profiel':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Meds" component={MedsScreen} />
      <Tab.Screen name="Herinneringen" component={HerinneringenScreen} />
      <Tab.Screen name="Historiek" component={HistoriekScreen} />
      <Tab.Screen name="Profiel" component={ProfielScreen} />
    </Tab.Navigator>
  );
}

// Main App
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        console.log('Expo Push Token:', token);
        // 🟡 TODO: Send token to backend to save in User table
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

```

#### 2. Backend

Store that token in your User model:

```js
expo_push_token: { type: DataTypes.STRING } // in user model
```

Then update the user record after login or in settings.

user.js:

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Medication = require('./medication');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  naam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  hashed_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pushToken: { // 👈 of noem het expo_push_token als je dat liever hebt
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Medication, { foreignKey: 'userId' });
Medication.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
```


#### 3. Send notification from backend

Install:

```bash
npm install expo-server-sdk
```

Send a notification in a new controller file, e.g., `/controllers/notificationController.js`:

```js
const { Expo } = require('expo-server-sdk');
const User = require('../models/user');
let expo = new Expo();

exports.sendTestEmail = async (req, res) => {
  try {
    const user = req.user;
    await sendReminderEmail(
      user.email,
      'Medicatie Herinnering',
      'Vergeet je medicatie niet in te nemen!'
    );
    res.json({ message: 'Email verzonden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email verzenden mislukt' });
  }
};

exports.sendTestPush = async (req, res) => {
  try {
    const user = req.user;

    if (!user.expo_push_token) {
      return res.status(400).json({ error: 'Geen push token aanwezig' });
    }

    if (!Expo.isExpoPushToken(user.expo_push_token)) {
      return res.status(400).json({ error: 'Push token is ongeldig' });
    }

    const messages = [{
      to: user.expo_push_token,
      sound: 'default',
      title: 'Herinnering',
      body: 'Neem je medicatie in!',
      data: { someData: '💊' },
    }];

    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    res.json({ message: 'Push verzonden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Push verzenden mislukt' });
  }
};

```

You can trigger this on a schedule using `node-cron`, or test it with a manual POST.

---

### B. E-mail Herinneringen via NodeMailer

Install:

```bash
npm install nodemailer
```

Set up `/controllers/emailController.js`:

```js
const nodemailer = require('nodemailer');

exports.sendEmailReminder = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Medicatie Herinnering',
    text: 'Vergeet niet om je medicatie in te nemen.'
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

In `.env`:

```
EMAIL_FROM=youremail@gmail.com
EMAIL_PASS=yourpassword
```

> ⚠️ Use an app password if using Gmail 2FA.

---

##  **STEP 6: Historiek & Kalender (Inname Logs)**

### 📘 A. Add a `ReminderLog` model

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReminderLog = sequelize.define('ReminderLog', {
  medication_id: { type: DataTypes.INTEGER, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('voltooid', 'gemist'), allowNull: false },
});

module.exports = ReminderLog;
```

Link it to `Medication` model.

---

### 📩 B. Create endpoints

In `/controllers/reminderController.js`:

```js
const ReminderLog = require('../models/reminderLog');
const Medication = require('../models/medication');

exports.logReminder = async (req, res) => {
  const { medication_id, status } = req.body;
  const log = await ReminderLog.create({
    medication_id,
    status,
    timestamp: new Date()
  });
  res.status(201).json(log);
};

exports.getLogs = async (req, res) => {
  const logs = await ReminderLog.findAll({
    include: {
      model: Medication,
      where: { userId: req.user.id }, // beveiligd per gebruiker
      attributes: ['naam'] // alleen naam als voorbeeld
    },
    order: [['timestamp', 'DESC']]
  });

  res.json(logs);
};
```

### 📅 C. In React Native:

Use a calendar library like:

```bash
npm install react-native-calendars
```

Then show:

* Dates with colored dots
* Green = "voltooid"
* Red = "gemist"

---

## ✅ **STEP 7: UI & Mobile UX Polish**

You already use Expo, so you can easily improve the design using:

### 🧱 A. Use UI libraries (optional but helpful)

* `react-native-paper`: Material-style components
* `react-native-vector-icons`: For tab icons
* `react-native-calendars`: For calendar

---

### 🪄 B. Suggested improvements:

* **Icons for each tab** (e.g. pills, bell, history, user)
* **Color code statuses** (green/red dots)
* **Switch between light/dark mode**
* **Simple loading spinners** when fetching data
* **Logout button in Profiel tab**

---

### Example `BottomTabNavigator`:

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MedsScreen from './screens/MedsScreen';
import RemindersScreen from './screens/RemindersScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Medicatie" component={MedsScreen} />
        <Tab.Screen name="Herinneringen" component={RemindersScreen} />
        <Tab.Screen name="Historiek" component={HistoryScreen} />
        <Tab.Screen name="Profiel" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## 🧩 Want me to generate any of these files for you?

Let me know which one(s) you want help with:

* Expo push notification setup code
* Medication screen component
* Auth screen
* API call helpers
* Calendar component for logs

You're nearly there — this app is going to impress once it's polished up.
