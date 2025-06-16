

# Gebruikersauthenticatie + Medicatiebeheer (JWT)

Nu bouwen we een backend met **gebruikersauthenticatie** (registratie, login met JWT) en **medicatiebeheer (CRUD)** met beveiligde routes.

## STAP 1: Maak het `User`-model aan

**Pad:** `backend/src/models/user.js`

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  naam: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  hashed_password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;
```

---

## STAP 2: Registratiecontroller aanmaken

**Pad:** `backend/src/controllers/authController.js`

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  try {
    const { naam, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email is al geregistreerd' });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const user = await User.create({ naam, email, hashed_password });

    res.status(201).json({ message: 'Gebruiker geregistreerd', user });
  } catch (error) {
    res.status(500).json({ error: 'Registratie mislukt', details: error.message });
  }
};
```

---

## STAP 3: Auth-routes aanmaken

**Pad:** `backend/src/routes/auth.js`

```js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
```

---

## STAP 4: Auth-routes koppelen aan je app

**Pad:** `backend/app.js`

```js
const express = require('express');
const app = express();

const authRoutes = require('./routes/auth');

app.use(express.json());
app.use('/api/auth', authRoutes);

module.exports = app;
```

---

## STAP 5: Server starten

**Pad:** `backend/server.js`

```js
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
  });
});
```

---

## STAP 6: Test registratie met Postman

**POST** `http://localhost:4000/api/auth/register`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "naam": "Jan Jansen",
  "email": "jan@example.com",
  "password": "wachtwoord123"
}
```

Je krijgt:

```json
{
  "message": "Gebruiker geregistreerd",
  "user": {
    "id": 1,
    "naam": "Jan Jansen",
    "email": "jan@example.com",
    ...
  }
}
```

---

## STAP 7: Logincontroller toevoegen

In `authController.js`, voeg dit toe:

```js
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ error: 'Ongeldige inloggegevens' });

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) return res.status(401).json({ error: 'Ongeldige inloggegevens' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login succesvol', token });
  } catch (error) {
    res.status(500).json({ error: 'Inloggen mislukt' });
  }
};
```

---

## STAP 8: Test login met Postman

**POST** `http://localhost:4000/api/auth/login`

**Body:**

```json
{
  "email": "jan@example.com",
  "password": "wachtwoord123"
}
```

Je krijgt:

```json
{
  "message": "Login succesvol",
  "token": "<JWT_TOKEN>"
}
```

---

## STAP 9: JWT Middleware voor beveiligde routes

**Pad:** `backend/src/middleware/authMiddleware.js`

```js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token ontbreekt' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'Ongeldige token' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token niet geldig of verlopen' });
  }
};
```

---

## STAP 10: Medicatiebeheer CRUD

### Model: `backend/src/models/medication.js`

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medication = sequelize.define('Medication', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  naam: { type: DataTypes.STRING, allowNull: false },
  dosis: { type: DataTypes.STRING, allowNull: false },
  frequentie: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY },
});

module.exports = Medication;
```

### ➕ Relatie in `user.js`

Onderin toevoegen:

```js
const Medication = require('./medication');
User.hasMany(Medication, { foreignKey: 'userId' });
Medication.belongsTo(User, { foreignKey: 'userId' });
```

---

### Controller: `controllers/medicationController.js`

```js
const Medication = require('../models/medication');

exports.create = async (req, res) => {
  try {
    const { naam, dosis, frequentie, startDate, endDate } = req.body;
    const med = await Medication.create({
      userId: req.user.id,
      naam, dosis, frequentie, startDate, endDate
    });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  const meds = await Medication.findAll({ where: { userId: req.user.id } });
  res.json(meds);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const med = await Medication.findOne({ where: { id, userId: req.user.id } });
  if (!med) return res.status(404).json({ error: 'Niet gevonden' });
  await med.update(req.body);
  res.json(med);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const deleted = await Medication.destroy({ where: { id, userId: req.user.id } });
  if (!deleted) return res.status(404).json({ error: 'Niet gevonden' });
  res.json({ message: 'Verwijderd' });
};
```

---

### Routes: `routes/medication.js`

```js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const medCtrl = require('../controllers/medicationController');

router.use(authMiddleware);

router.post('/', medCtrl.create);
router.get('/', medCtrl.list);
router.put('/:id', medCtrl.update);
router.delete('/:id', medCtrl.remove);

module.exports = router;
```

### Voeg toe in `app.js`

```js
const medRoutes = require('./routes/medication');
app.use('/api/medications', medRoutes);
```

---

## Test de medicatie-API

Gebruik je JWT-token in de headers:

```
Authorization: Bearer <JWT_TOKEN>
```

* **GET** `/api/medications`
* **POST** `/api/medications`
* **PUT** `/api/medications/:id`
* **DELETE** `/api/medications/:id`

Als alles werkt dan kan je na je vorige 5 mental breakdowns rusten 
