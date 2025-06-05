require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
  });
});