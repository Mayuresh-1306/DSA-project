const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.get('/nearby', driverController.getNearbyDrivers);
router.get('/', driverController.getAllDrivers);
router.get('/:id', driverController.getDriver);
router.post('/', driverController.createDriver);
router.patch('/:id/location', driverController.updateLocation);
router.patch('/:id/status', driverController.updateStatus);

module.exports = router;
