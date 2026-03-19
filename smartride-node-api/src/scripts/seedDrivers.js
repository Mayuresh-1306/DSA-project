/**
 * ============================================================
 *  Seed Script — Populate MongoDB with test drivers
 * ============================================================
 *
 *  Run: node src/scripts/seedDrivers.js
 *
 *  Creates 20 drivers spread across Pune city with realistic
 *  coordinates matching the city graph nodes.
 * ============================================================
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartride';

const driverSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  rating: Number,
  status: String,
  vehicleType: String,
  totalRides: Number,
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number]
  }
});
driverSchema.index({ location: '2dsphere' });
const Driver = mongoose.model('Driver', driverSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Connected to MongoDB');

    await Driver.deleteMany({});
    console.log('🗑️  Cleared existing drivers');

    const FIRST_NAMES = ['Rajesh', 'Amit', 'Suresh', 'Vikram', 'Prashant', 'Nitin', 'Sanjay', 'Mahesh', 'Ganesh', 'Rahul', 'Deepak', 'Anil', 'Kiran', 'Sachin', 'Prakash', 'Rohit', 'Vishal', 'Akash', 'Omkar', 'Tushar', 'Priya', 'Neha', 'Pooja', 'Sneha'];
    const LAST_NAMES = ['Kumar', 'Patil', 'Jadhav', 'Singh', 'More', 'Deshmukh', 'Kulkarni', 'Shinde', 'Pawar', 'Bhosale', 'Wagh', 'Gaikwad', 'Mane', 'Joshi', 'Chavan', 'Sonawane', 'Deshpande', 'Tawde', 'Salunkhe', 'Phadke'];
    const VEHICLE_TYPES = ['sedan', 'suv', 'auto', 'bike'];

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    const docs = [];
    for (let i = 0; i < 150; i++) {
      const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const vType = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
      const lat = 18.44 + Math.random() * 0.20; 
      const lng = 73.72 + Math.random() * 0.26;
      const rating = 4.0 + (Math.random() * 1.0); 

      docs.push({
        name: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@smartride.com`,
        password: defaultPassword,
        rating: parseFloat(rating.toFixed(1)),
        vehicleType: vType,
        totalRides: Math.floor(Math.random() * 500) + 50,
        status: 'AVAILABLE',
        location: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      });
    }

    await Driver.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} drivers across Pune city with hashed passwords`);

    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
