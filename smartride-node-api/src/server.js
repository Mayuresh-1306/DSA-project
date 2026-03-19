const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // CRITICAL: Load env variables BEFORE importing local services

const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const javaEngine = require('./services/javaEngineService');

const app = express();

app.use(cors());
app.use(express.json());

// ── Route Mounts ──
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/pricing', pricingRoutes);

// ── Health Check (also checks Java Engine) ──
app.get('/api/health', async (req, res) => {
  try {
    const javaHealth = await javaEngine.checkHealth();
    res.json({
      nodeServer: 'UP',
      javaEngine: javaHealth,
      database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
  } catch (error) {
    res.json({
      nodeServer: 'UP',
      javaEngine: 'DOWN — ' + error.message,
      database: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
  }
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartride';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('📦 MongoDB connected');
    app.listen(PORT, () => {
      console.log(`\n🚀 Node.js API Gateway running on port ${PORT}`);
      console.log(`📡 Java Engine expected at: ${process.env.JAVA_ENGINE_URL || 'http://localhost:8080/api/engine'}`);
      console.log(`\n📋 Available Endpoints:`);
      console.log(`   POST   /api/rides/request`);
      console.log(`   GET    /api/rides/:id`);
      console.log(`   PATCH  /api/rides/:id/complete`);
      console.log(`   PATCH  /api/rides/:id/cancel`);
      console.log(`   GET    /api/drivers`);
      console.log(`   POST   /api/drivers`);
      console.log(`   PATCH  /api/drivers/:id/location`);
      console.log(`   PATCH  /api/drivers/:id/status`);
      console.log(`   GET    /api/drivers/nearby?lng=&lat=`);
      console.log(`   GET    /api/pricing/estimate?distance=`);
      console.log(`   POST   /api/pricing/route-estimate`);
      console.log(`   GET    /api/health\n`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });