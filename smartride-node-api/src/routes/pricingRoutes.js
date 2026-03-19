const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');

router.get('/estimate', pricingController.getEstimate);
router.post('/route-estimate', pricingController.getRouteEstimate);

module.exports = router;
