const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const medCtrl = require('../controllers/medicationController');
const medicationController = require('../controllers/medicationController');


// Middleware: authentication + logging
router.use(authMiddleware);
router.use((req, _res, next) => {
  console.log('🛡️ Authenticated user ID:', req.user.id);
  next();
});

// Routes
router.get('/', authMiddleware, medicationController.getMedications);
router.post('/', medCtrl.create);
router.get('/', medCtrl.list);
router.put('/:id', medCtrl.update);
router.delete('/:id', medCtrl.remove);

module.exports = router;

