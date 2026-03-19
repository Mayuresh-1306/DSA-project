const axios = require('axios');

/**
 * ============================================================
 *  Java Engine Service — Bridge between Node.js and Java
 * ============================================================
 *
 *  This module encapsulates ALL communication with the Java
 *  Algorithm Microservice. The controller never calls Java
 *  directly — it goes through this service layer.
 *
 *  ARCHITECTURE INSIGHT:
 *  Node.js (I/O-heavy, non-blocking) handles HTTP requests,
 *  database queries, and response formatting.
 *  Java (CPU-heavy, JVM-optimized) handles graph algorithms,
 *  heap operations, and mathematical computations.
 *
 *  Communication: REST over HTTP (localhost:8080)
 *  In production: gRPC for lower latency, or message queue for async
 * ============================================================
 */

const JAVA_ENGINE_BASE = process.env.JAVA_ENGINE_URL || 'http://localhost:8080/api/engine';

const javaClient = axios.create({
  baseURL: JAVA_ENGINE_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Call Java engine to match the best driver for a ride.
 * Java runs: GreedyMatcher → MinHeap → A* → DynamicPricing
 */
exports.matchDriver = async (rideId, pickupNode, dropoffNode, availableDrivers) => {
  const response = await javaClient.post('/match', {
    rideId,
    pickupNode,
    dropoffNode,
    availableDrivers
  });
  return response.data;
};

/**
 * Call Java engine to compute shortest route via A* / Dijkstra.
 */
exports.computeRoute = async (source, destination) => {
  const response = await javaClient.post('/route', { source, destination });
  return response.data;
};

/**
 * Call Java engine to calculate dynamic surge pricing.
 */
exports.calculatePrice = async (distance, activeRidesInZone, availableDriversInZone) => {
  const response = await javaClient.post('/price', {
    distance,
    activeRidesInZone,
    availableDriversInZone
  });
  return response.data;
};

/**
 * Health check — verify Java engine is running.
 */
exports.checkHealth = async () => {
  const response = await javaClient.get('/health');
  return response.data;
};
