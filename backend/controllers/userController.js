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

const getProfile = async (req, res) => {
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

const updateProfile = async (req, res) => {
  try {
    const { name, phone, department, plantLocation } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (plantLocation !== undefined) user.plantLocation = plantLocation;

    await user.save();

    return res.json({
      success: true,
      user: buildUserObject(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.avatarUrl = avatarUrl || '';
    await user.save();

    return res.json({
      success: true,
      user: buildUserObject(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, updateAvatar };
