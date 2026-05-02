const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', protect, admin, categoryController.createCategory);
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router;
