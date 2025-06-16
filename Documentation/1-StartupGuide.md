

# Medicatie Herinneringsapp – Startup Guide

Hier ga ik over alle instalaties om te beginnen, hoe ik op Windows een projectmap opzet, Node.js/Express backend initialiseert, PostgreSQL installeert en configureert, en een React Native (Expo) frontend klaarzet. 

---

## 1. PreInstalaties 

Git, Node.js, VSCode en nmp waren al geinstalleerd op mijn laptop, maar ik heb het toch toegevoegd. 

### 1.1. Git

1. Ga naar [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download de Windows-versie en voer de installer uit.
3. Bij installatie kies je standaardopties (volgende → volgende → afronden).

### 1.2. Node.js & npm

1. Ga naar [https://nodejs.org](https://nodejs.org)
2. Download de LTS-versie (diegene met "Recommended for most users").
3. Voer de installer uit, kies standaardopties.
4. Controleer: Open PowerShell (zoek naar "PowerShell" in Start), typ:

```powershell
   node -v
   npm -v
```

   Je ziet twee versienummers (bv. v18.17.1 en 9.x.x).

### 1.3. PostgreSQL

1. Ga naar [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Download de EnterpriseDB-installer en installeer met standaardinstellingen.
3. Kies tijdens installatie een wachtwoord voor de database-superuser (gebruik bv. `postgres` als je niets wilt onthouden).
4. Na installatie start pgAdmin automatisch. Je kunt pgAdmin sluiten; we gebruiken alleen de database.
5. Voeg het commandopad (PATH) toe aan Windows: Zoek in Start naar "Omgevingsvariabelen bewerken" → klik "Omgevingsvariabelen…" → onder "Systeemvariabelen" selecteer `Path` → Bewerken → Nieuw → typ de map waar `psql.exe` zit (bv. `C:\Program Files\PostgreSQL\15\bin`) → OK.
6. Controleer in PowerShell:

```powershell
   psql --version
```

   Je zou iets als `psql (PostgreSQL) 15.x` moeten zien.

### 1.4. VSCode

1. Ga naar [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Download en installeer VSCode.
3. Open VSCode en installeer de extensie **"ESLint"** en **"Prettier"** (via Extensions, zoek op naam).
4. Installeer de **"PostgreSQL"** extensie (sleutelicoon -> "PostgreSQL").


## 2. Projectmap en Git Repository

1. Maak een map voor je project:

   * In PowerShell:

```powershell
     cd \(een locatie van jouw keuze, bijv. C:\Users\<jouw-naam>\Documents)
     mkdir medicatie-herinnering-app
     cd medicatie-herinnering-app
```
   * Of in Verkenner: Rechtsklik → Nieuw → Map → noem `medicatie-herinnering-app` → dubbelklik om te openen.
2. Open deze map in VSCode:

   * In VSCode: File → Open Folder… → kies `medicatie-herinnering-app` → klik "Select Folder".
3. Initialiseer Git in VSCode:

   * Open de geïntegreerde terminal (Ctrl+\` ) en typ:

 ```bash
     git init
```
   * Je ziet nu `Initialized empty Git repository`.


## 3. Backend: Node.js + Express + Sequelize + PostgreSQL

### 3.1. Mapstructuur

1. In de projectmap met VSCode-terminal:

```bash
   mkdir backend
   cd backend
   npm init -y
   npm install cors
```
2. Installeer dependencies:

```bash
   npm install express dotenv pg sequelize sequelize-cli bcrypt jsonwebtoken
   ```
3. Maak basisfolders:

```bash
    mkdir src
    cd src
    mkdir config,controllers,models,routes,middleware
    cd ..
```

4. Open `.gitignore` in VSCode en voeg regels toe:

```gitignore
   node_modules/
   .env
   ```

5. Voeg regels toe in server.js

```js 
// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
res.send("Medicatie Herinneringsapp API is running!");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
```

6. maak database.js aan indien die niet bestaat 

Controleer of je dit bestand hebt:
backend/src/config/database.js

Als het er niet is, maak het dan aan en plak deze code erin:

```js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'medicatieapp',
  username: 'postgres',
  password: 'jouw_wachtwoord' // vervang dit door je eigen wachtwoord
});

module.exports = sequelize;
```

Vergeet niet alles dat verandert moet te veranderen.

### 3.2. Omgevingsvariabelen

Open `.env` en plak:


```js
PORT=4000
DATABASE_URL=postgres://postgres:yourPostgresPassword@localhost:5432/medapp_db
JWT_SECRET=yourSecretJWTkey
```

Vervang:

yourPostgresPassword met de password die je hebt gezet tijdens de PostgreSQL installatie

yourSecretJWTkey met een sterke sleutel (used to sign JWTs), e.g., mysuperlongsecret123!

### 3.3. Database aanmaken

1. Open een nieuwe PowerShell en typ:

   ```powershell
   psql -U postgres
   ```
   (gebruik je postgres-wachtwoord)

Als dit niet werkt is het omdat PowerShell het commando psql niet herkent. Dat komt omdat de PostgreSQL-map nog niet is toegevoegd aan je systeem-PATH.

Open je terminal (PowerShell of Command Prompt) en typ:

```powershell
Get-ChildItem "C:\Program Files\PostgreSQL" -Directory
```

Je ziet een lijst met versies, bijvoorbeeld 15, 16, etc. Kies de juiste versie en controleer of de bin-map bestaat:

```powershell
Get-ChildItem "C:\Program Files\PostgreSQL\15\bin"
```

Als daar psql.exe tussen staat, dan is dit de map die je nodig hebt.

Voeg de bin-map toe aan je PATH

Gebruik deze opdracht om het pad permanent toe te voegen 

```powershell
[System.Environment]::SetEnvironmentVariable(
"Path",
$env:Path + ";C:\Program Files\PostgreSQL\15\bin",
[System.EnvironmentVariableTarget]::Machine
)
```
! vervang 15 met de echte versie ! 

en nu probeer opnieuw

2. Maak database:

```sql
   CREATE DATABASE medapp_db;
   CREATE DATABASE medicatieapp;
   \q
```

### 3.4. `server.js` starten

Open `backend/server.js` en plak:

```js
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend draait!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is live op poort ${PORT}`));
```
Als er lijnen 2/meer keer staan, verwijder de kopies. 

Start de server:

```bash
npm install -g nodemon   # één keer nodig per PC
nodemon server.js
```

Ga in je browser naar `http://localhost:4000` → je ziet "Backend draait!" ofzo iets.


## 4. Frontend: React Native (Expo)

### 4.1. Expo CLI installeren

In een *nieuwe* VSCode-terminal (of PowerShell):

```bash
npm install -g expo-cli
expo --version  # om zeker te zijn dat het is geinstaleerd
npm install -g npm@11.4.0 # voor nieuwste versie
```

als je problemen hebt : 

```bash
npm config get prefix
```
om het pad te krijgen 

dan: 

```powershell
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$npmPath = "C:\Path\to\directory"
if (-not ($userPath -like "*$npmPath*")) {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;$npmPath", "User")
    Write-Output "✅ Pad toegevoegd aan gebruikers-PATH."
} else {
    Write-Output "ℹ️ Pad is al aanwezig in PATH."
}
```
leg de juiste pad hierin ! 


### 4.2. Project aanmaken

1. Ga terug naar de root map (`medicatie-herinnering-app`):

```bash
   cd ..  # vanuit backend/
   ```
2. Maak mobile map:

```bash
   expo init mobile-app
   ```

   A lot of errors could happen here, you need to make sure that the Path of NPM is actally added, you need to make sure that no security measures are blocking you, and you need to stop trying until you've restarted your laptop cuz sometimes everything is correct but your dumbass keeps retrying without having restarted the laptop (yes I made that mistake)

3. Kies tijdens de prompt: **blank (TypeScript)**
4. Navigeer naar de map en start:

```bash
   cd mobile-app
   expo start
   ```
5. Er opent een browser met de Metro bundler. Scan de QR-code met Expo Go op je telefoon of druk `i` om iOS-simulator, `a` voor Android.

### 4.3. Eerste scherm testen

Open `mobile-app/App.tsx` in VSCode, pas de tekst aan ALS `mobile-app/App.tsx` leeg is :

```tsx
import { Text, View } from 'react-native';
export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hallo Medicatie App!</Text>
    </View>
  );
}
```

Sla op, en zie de tekst direct wijzigen in de emulator of telefoon.


**Gefeliciteerd!** Je hebt nu een werkend Node.js backend en een React Native Expo front-end klaargezet, met PostgreSQL database en GitHub repository, en 5 mental breakdowns. 