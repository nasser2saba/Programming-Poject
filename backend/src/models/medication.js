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