const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.delete('/profile', protect, userController.deleteAccount);

// Admin routes
router.get('/', protect, admin, userController.getAllUsers);
router.put('/:id/status', protect, admin, userController.toggleUserStatus);
router.delete('/:id', protect, admin, userController.deleteUser);

module.exports = router;
