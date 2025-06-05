const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const medCtrl = require('../controllers/medicationController');

router.use(authMiddleware);

router.post('/', medCtrl.create);
router.get('/', medCtrl.list);
router.put('/:id', medCtrl.update);
router.delete('/:id', medCtrl.remove);

module.exports = router;