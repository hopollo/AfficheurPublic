'use strict';

const router = require('express').Router();
const multer = require('multer');
const path = require('path');

const public_controller = require('../controllers/publicController');

// Multer Config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => next(null, path.resolve('./public' + req.baseUrl)),
    filename: (req, file, next) => next(null, file.originalname)
  })
});

module.exports = router;

router.get('/', public_controller.index);

router.get('/upload', public_controller.upload_get);

router.post('/upload', upload.single('file'), (req, res, next) => {
  next();
}, public_controller.upload_post);
