const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const notifCtrl = require('../controllers/notificationController');

// Use auth middleware for all routes
router.use(authMiddleware);

router.post('/send-test-email', notifCtrl.sendTestEmail);
router.post('/send-test-push', notifCtrl.sendTestPush);
router.post('/savePushToken', notifCtrl.savePushToken);

module.exports = router;
