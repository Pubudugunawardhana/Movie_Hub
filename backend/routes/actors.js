const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', actorController.getActors);
router.post('/', protect, admin, upload.single('photo'), actorController.createActor);
router.put('/:id', protect, admin, upload.single('photo'), actorController.updateActor);
router.delete('/:id', protect, admin, actorController.deleteActor);

module.exports = router;
