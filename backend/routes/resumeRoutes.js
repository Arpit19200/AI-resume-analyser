const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('resume'), uploadResume);

module.exports = router;
