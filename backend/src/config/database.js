const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'medicatieapp',
  username: 'postgres',
  password: 'SssLll&06IC', // vervang dit door je eigen wachtwoord
  logging: console.log, // <-- this line enables SQL logs
});

module.exports = sequelize;
