const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/cast/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
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
