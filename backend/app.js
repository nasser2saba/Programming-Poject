const express = require('express');
const app = express();
const medRoutes = require('./routes/medication');
const authRoutes = require('./src/routes/auth');

// Middleware om JSON te kunnen lezen
app.use(express.json());

// Gebruik onze auth routes onder /api/auth
app.use('/api/auth', authRoutes);

app.use('/api/medications', medRoutes);

module.exports = app;

   
   