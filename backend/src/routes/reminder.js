const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reminderCtrl = require('../controllers/reminderController');

// Authenticated routes
router.use(authMiddleware);

// Fetch logs for current user
router.get('/', reminderCtrl.getLogs);

module.exports = router;
