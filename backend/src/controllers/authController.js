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