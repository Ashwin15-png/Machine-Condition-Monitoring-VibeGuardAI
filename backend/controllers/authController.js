const jwt = require('jsonwebtoken');
const User = require('../models/User');

const buildUserObject = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  department: u.department,
  plantLocation: u.plantLocation,
  avatarUrl: u.avatarUrl,
  employeeId: u.employeeId,
  phone: u.phone,
  status: u.status,
  lastLogin: u.lastLogin,
  createdAt: u.createdAt,
});

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'vibe_guard_industrial_jwt_secret_key_2026_super_secure',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: buildUserObject(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

  const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      ...(role && { role }),  // Only override if role is actually sent
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'vibe_guard_industrial_jwt_secret_key_2026_super_secure',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: buildUserObject(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    return res.json({
      success: true,
      user: buildUserObject(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login, register, getMe };
