const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vibe_guard_industrial_jwt_secret_key_2026_super_secure');
    const u = await User.findById(decoded.id);
    if (!u) {
       return res.status(401).json({ success: false, message: 'Token belongs to an invalid user.' });
    }
    req.user = u;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'Unknown'}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
