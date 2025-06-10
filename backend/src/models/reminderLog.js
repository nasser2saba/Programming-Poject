const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Medication = require('./medication');

const ReminderLog = sequelize.define('ReminderLog', {
  medication_id: { type: DataTypes.INTEGER, allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('voltooid', 'gemist'), allowNull: false },
});

ReminderLog.belongsTo(Medication, {
  foreignKey: 'medication_id',
});

Medication.hasMany(ReminderLog, {
  foreignKey: 'medication_id',
});
module.exports = ReminderLog;
