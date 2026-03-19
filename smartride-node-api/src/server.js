const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rideRoutes = require('./routes/rideRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/rides', rideRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartride')
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Node API Gateway running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });