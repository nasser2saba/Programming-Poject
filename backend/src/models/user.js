const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Medication = require('./medication');

const User = sequelize.define('Users', {
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
});

User.hasMany(Medication, { foreignKey: 'userId' });
Medication.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
