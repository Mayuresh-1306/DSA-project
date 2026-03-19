const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rider Auth Routes
router.post('/user/register', authController.registerRider);
router.post('/user/login', authController.loginRider);

// Driver Auth Routes
router.post('/driver/register', authController.registerDriver);
router.post('/driver/login', authController.loginDriver);

module.exports = router;
