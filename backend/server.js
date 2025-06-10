// Load environment variables
require("dotenv").config();
require('./src/models/user');
require('./src/models/medication');

const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/database");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./src/routes/auth");
const medicationRoutes = require("./src/routes/medication");
const notificationRoutes = require("./src/routes/notification");
const reminderRoutes = require("./src/routes/reminder");



app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders", reminderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Medicatie Herinneringsapp API is running!");
});

// Start server
const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  console.log("✅ Tabellen gesynchroniseerd");
  app.listen(PORT, () => {
    console.log(`✅ Server draait op poort ${PORT}`);
  });
});
