const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

console.log("✅ auth.js geladen");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/save-push-token', authMiddleware, authController.savePushToken);

router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
