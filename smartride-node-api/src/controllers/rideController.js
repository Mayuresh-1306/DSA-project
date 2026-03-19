const Driver = require('../models/driver');
const Ride = require('../models/ride');
const axios = require('axios');

exports.requestRide = async (req, res) => {
  try {
    const { riderId, pickupCoords, pickupNode, dropoffNode } = req.body;

    const nearbyDrivers = await Driver.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: pickupCoords
          },
          $maxDistance: 3000
        }
      },
      status: 'AVAILABLE'
    }).limit(50);

    if (nearbyDrivers.length === 0) {
      return res.status(404).json({ error: 'No drivers available in your quadrant.' });
    }

    const newRide = new Ride({
      riderId,
      pickupNode,
      dropoffNode
    });
    await newRide.save();

    const javaEngineUrl = process.env.JAVA_ENGINE_URL || 'http://localhost:8080/api/engine/match';
    
    const javaResponse = await axios.post(javaEngineUrl, {
      rideId: newRide._id,
      pickupNode,
      dropoffNode,
      availableDrivers: nearbyDrivers.map(d => ({
        id: d._id,
        rating: d.rating,
        coordinates: d.location.coordinates
      }))
    });

    const { matchedDriverId, routeDistance, optimizedPrice } = javaResponse.data;

    newRide.driverId = matchedDriverId;
    newRide.status = 'MATCHED';
    newRide.price = optimizedPrice;
    newRide.estimatedTime = routeDistance * 2; 
    await newRide.save();

    await Driver.findByIdAndUpdate(matchedDriverId, { status: 'ON_RIDE' });

    res.status(200).json({
      success: true,
      ride: newRide,
      message: 'Optimal driver matched successfully via Java Engine.'
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error during matching pipeline.' });
  }
};