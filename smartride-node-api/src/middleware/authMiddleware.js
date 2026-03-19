const jwt = require('jsonwebtoken');

// Secret for signing JWT. In production, always use process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'smartride_super_secret_key_2026';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No token provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // { id, role }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid Token' });
  }
};

module.exports = { verifyToken, JWT_SECRET };
