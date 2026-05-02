const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { protect, admin } = require('../middleware/auth');

router.get('/', actorController.getActors);
router.post('/', protect, admin, actorController.createActor);
router.delete('/:id', protect, admin, actorController.deleteActor);

module.exports = router;
