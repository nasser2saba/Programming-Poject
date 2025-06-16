const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UniqueConstraintError, ValidationError } = require('sequelize');

// /api/auth/me
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden' });
    }

    res.json({
      email: user.email,
      name: user.naam || '', // Voeg eventueel ook 'naam' toe
    });
  } catch (err) {
    console.error('❌ Fout bij ophalen gebruiker:', err);
    res.status(500).json({ error: 'Serverfout' });
  }
};

exports.register = async (req, res) => {
  console.log('🔍 register payload =', req.body);
  try {
    const { naam, email, password } = req.body;

    if (!naam || !email || !password) {
      return res.status(400).json({ error: 'naam, email en password zijn verplicht' });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    const user = await User.create({
      naam,
      email,
      hashed_password,
    });

    return res.status(201).json({
      message: 'Gebruiker geregistreerd',
      user: {
        id: user.id,
        naam: user.naam,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        error: 'E-mail bestaat al',
        details: error.errors.map(e => ({
          veld: e.path,
          boodschap: e.message
        }))
      });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: 'Validatiefout',
        details: error.errors.map(e => ({
          veld: e.path,
          boodschap: e.message
        }))
      });
    }
    console.error(error);
    return res.status(500).json({ error: 'Registratie mislukt', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email en password zijn verplicht' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login succesvol',
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Inloggen mislukt' });
  }
};

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
