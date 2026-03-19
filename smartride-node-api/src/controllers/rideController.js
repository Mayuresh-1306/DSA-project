const Driver = require('../models/driver');
const Ride = require('../models/ride');
const javaEngine = require('../services/javaEngineService');

/**
 * ============================================================
 *  Ride Controller — Handles all ride-related API requests
 * ============================================================
 *
 *  FLOW (Interview-ready explanation):
 *  1. Rider sends POST /api/rides/request with pickup & dropoff
 *  2. Node.js queries MongoDB for nearby available drivers (2dsphere)
 *  3. Node.js sends driver list + locations to Java Engine
 *  4. Java runs Dijkstra/A*, MinHeap ranking, Greedy matching
 *  5. Java returns matched driver + route + price
 *  6. Node.js updates MongoDB and responds to frontend
 * ============================================================
 */

// ── POST /api/rides/request ──
exports.requestRide = async (req, res) => {
  try {
    const { riderId, pickupCoords, pickupNode, dropoffNode } = req.body;

    if (!riderId || !pickupCoords || !pickupNode || !dropoffNode) {
      return res.status(400).json({ error: 'Missing required fields: riderId, pickupCoords, pickupNode, dropoffNode' });
    }

    // STEP 1: Query MongoDB for nearby available drivers using 2dsphere index
    // Time: O(log N) with geospatial index, N = total drivers
    const nearbyDrivers = await Driver.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: pickupCoords  // [longitude, latitude]
          },
          $maxDistance: 5000  // 5 km radius
        }
      },
      status: 'AVAILABLE'
    }).limit(50);

    if (nearbyDrivers.length === 0) {
      return res.status(404).json({
        error: 'No drivers available nearby.',
        suggestion: 'Please try again in a few minutes.'
      });
    }

    // STEP 2: Create ride record in MongoDB (status: SEARCHING)
    const newRide = new Ride({
      riderId,
      pickupNode,
      dropoffNode,
      pickupCoords: { type: 'Point', coordinates: pickupCoords }
    });
    await newRide.save();

    // STEP 3: Send data to Java Algorithm Engine
    const matchResult = await javaEngine.matchDriver(
      newRide._id.toString(),
      pickupNode,
      dropoffNode,
      nearbyDrivers.map(d => ({
        id: d._id.toString(),
        rating: d.rating,
        coordinates: d.location.coordinates
      }))
    );

    // STEP 4: Update ride with match results from Java Engine
    newRide.driverId = matchResult.matchedDriverId;
    newRide.status = 'MATCHED';
    newRide.price = matchResult.optimizedPrice;
    newRide.estimatedTime = matchResult.estimatedTimeMinutes;
    newRide.routePath = matchResult.routePath;
    newRide.routeDistance = matchResult.routeDistance;
    newRide.surgeMultiplier = matchResult.surgeMultiplier;
    await newRide.save();

    // STEP 5: Mark driver as ON_RIDE
    await Driver.findByIdAndUpdate(matchResult.matchedDriverId, { status: 'ON_RIDE' });

    res.status(200).json({
      success: true,
      ride: newRide,
      matchDetails: {
        driverScore: matchResult.driverScore,
        driverDistanceToPickup: matchResult.driverDistanceToPickup,
        algorithm: 'A* + MinHeap GreedyMatcher'
      },
      message: '✅ Optimal driver matched via Java DSA Engine.'
    });

  } catch (error) {
    console.error('❌ Ride request failed:', error.message);
    res.status(500).json({
      error: 'Matching pipeline failed.',
      details: error.message
    });
  }
};

// ── GET /api/rides/:id ──
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driverId');
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── PATCH /api/rides/:id/complete ──
exports.completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.status !== 'MATCHED') {
      return res.status(400).json({ error: 'Can only complete a MATCHED ride' });
    }

    ride.status = 'COMPLETED';
    ride.completedAt = new Date();
    await ride.save();

    // Free up the driver
    await Driver.findByIdAndUpdate(ride.driverId, { status: 'AVAILABLE' });

    res.json({ success: true, ride, message: 'Ride completed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── PATCH /api/rides/:id/cancel ──
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Cannot cancel a completed ride' });
    }

    ride.status = 'CANCELLED';
    await ride.save();

    // Free up the driver if one was assigned
    if (ride.driverId) {
      await Driver.findByIdAndUpdate(ride.driverId, { status: 'AVAILABLE' });
    }

    res.json({ success: true, ride, message: 'Ride cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ── GET /api/rides/history/:riderId ──
exports.getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ riderId: req.params.riderId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('driverId');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};