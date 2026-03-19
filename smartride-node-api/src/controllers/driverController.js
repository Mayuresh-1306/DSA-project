const Driver = require('../models/driver');

/**
 * Driver Controller — CRUD operations for drivers
 */

// ── GET /api/drivers ──
exports.getAllDrivers = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};
    const drivers = await Driver.find(filter).limit(parseInt(limit));
    res.json({ count: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET /api/drivers/:id ──
exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── POST /api/drivers ──
exports.createDriver = async (req, res) => {
  try {
    const { name, rating, vehicleType, coordinates } = req.body;

    if (!name || !coordinates) {
      return res.status(400).json({ error: 'name and coordinates are required' });
    }

    const driver = new Driver({
      name,
      rating: rating || 4.5,
      vehicleType: vehicleType || 'sedan',
      location: {
        type: 'Point',
        coordinates  // [longitude, latitude]
      }
    });

    await driver.save();
    res.status(201).json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── PATCH /api/drivers/:id/location ──
// Simulates real-time driver location updates
exports.updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;  // [longitude, latitude]
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ error: 'coordinates must be [lng, lat]' });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { 'location.coordinates': coordinates },
      { new: true }
    );

    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── PATCH /api/drivers/:id/status ──
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['AVAILABLE', 'ON_RIDE', 'OFFLINE'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET /api/drivers/nearby ──
// Find drivers near a given location
exports.getNearbyDrivers = async (req, res) => {
  try {
    const { lng, lat, radius = 3000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ error: 'lng and lat query params required' });
    }

    const drivers = await Driver.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      status: 'AVAILABLE'
    }).limit(50);

    res.json({ count: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
