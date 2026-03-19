const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/request', rideController.requestRide);
router.get('/history/:riderId', rideController.getRideHistory);
router.get('/:id', rideController.getRide);
router.patch('/:id/complete', rideController.completeRide);
router.patch('/:id/cancel', rideController.cancelRide);

module.exports = router;