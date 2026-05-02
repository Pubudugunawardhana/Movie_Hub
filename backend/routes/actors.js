const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get('/', actorController.getActors);
router.post('/', protect, admin, upload.single('photo'), actorController.createActor);
router.delete('/:id', protect, admin, actorController.deleteActor);

module.exports = router;
