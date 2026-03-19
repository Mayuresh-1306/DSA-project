const javaEngine = require('../services/javaEngineService');

/**
 * Pricing Controller — Dynamic pricing endpoints
 * These call the Java Engine for surge price calculations.
 */

// ── GET /api/pricing/estimate ──
exports.getEstimate = async (req, res) => {
  try {
    const { distance, activeRides = 5, availableDrivers = 10 } = req.query;

    if (!distance) {
      return res.status(400).json({ error: 'distance query param required' });
    }

    const priceData = await javaEngine.calculatePrice(
      parseFloat(distance),
      parseInt(activeRides),
      parseInt(availableDrivers)
    );

    res.json({ success: true, pricing: priceData });
  } catch (error) {
    res.status(500).json({ error: 'Pricing engine error: ' + error.message });
  }
};

// ── POST /api/pricing/route-estimate ──
// Get price estimate for a specific route
exports.getRouteEstimate = async (req, res) => {
  try {
    const { source, destination, activeRides = 5, availableDrivers = 10 } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ error: 'source and destination required' });
    }

    // Get route distance from Java Engine
    const routeData = await javaEngine.computeRoute(source, destination);

    // Get dynamic price from Java Engine
    const priceData = await javaEngine.calculatePrice(
      routeData.totalDistance,
      parseInt(activeRides),
      parseInt(availableDrivers)
    );

    res.json({
      success: true,
      route: routeData,
      pricing: priceData
    });
  } catch (error) {
    res.status(500).json({ error: 'Route pricing error: ' + error.message });
  }
};
