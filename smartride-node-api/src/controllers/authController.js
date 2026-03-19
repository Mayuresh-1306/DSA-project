const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Driver = require('../models/driver');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// ── RIDER AUTHENTICATION ──
exports.registerRider = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id, 'rider');

    res.status(201).json({ success: true, token, user: { id: user._id, name, email, role: 'rider' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginRider = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id, 'rider');
    res.json({ success: true, token, user: { id: user._id, name: user.name, email, role: 'rider' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DRIVER AUTHENTICATION ──
exports.registerDriver = async (req, res) => {
  try {
    const { name, email, password, vehicleType } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) return res.status(400).json({ error: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Give default coordinates so 2dsphere index doesn't crash
    const driver = await Driver.create({
      name, email, password: hashedPassword, vehicleType: vehicleType || 'sedan',
      location: { type: 'Point', coordinates: [73.8567, 18.5204] } // Default Pune center
    });

    const token = generateToken(driver._id, 'driver');
    res.status(201).json({ success: true, token, driver: { id: driver._id, name, email, role: 'driver' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    
    if (!driver || !(await bcrypt.compare(password, driver.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(driver._id, 'driver');
    res.json({ success: true, token, driver: { id: driver._id, name: driver.name, email, role: 'driver' } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
