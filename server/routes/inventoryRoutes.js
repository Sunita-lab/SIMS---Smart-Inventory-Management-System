const express = require('express');
const router = express.Router();
const { adjustStock, getLogs } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/adjust', protect, adjustStock);
router.get('/logs', protect, getLogs);

module.exports = router;