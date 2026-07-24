const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getProfile);
router.patch('/me', protect, updateProfile);
router.put('/avatar', protect, updateAvatar);

module.exports = router;
