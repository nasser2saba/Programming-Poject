const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

console.log("✅ auth.js geladen");


// Registratie route
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/save-push-token', authMiddleware, authController.savePushToken);


// Temporary test route 
//router.get('/test', (req, res) => {
//  res.send('Test route werkt');
//});


module.exports = router;


