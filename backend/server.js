require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
res.send("Medicatie Herinneringsapp API is running!");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});