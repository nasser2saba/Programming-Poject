const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { sendTestEmail, sendTestPush } = require('../controllers/notificationController');

router.post('/send-test-email', authMiddleware, sendTestEmail);
router.post('/send-test-push', authMiddleware, sendTestPush); // deze toevoegen

module.exports = router;

