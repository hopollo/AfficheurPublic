'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Require controller modules.
const index_controller = require('../controllers/indexController');
const dir_controller = require('../controllers/dirController');
const about_controller = require('../controllers/aboutController');
const admin_controller = require('../controllers/adminController');

// Multer Config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => next(null, path.resolve('./public/' + req.params.dir)),
    filename: (req, file, next) => next(null, file.originalname)
  })
});

module.exports = router;

// GET home page
router.get('/', index_controller.index);

// GET about page
router.get('/about', about_controller.index);

// GET admin page
router.get('/admin', admin_controller.index);

// GET vue page
router.get('/:dir', dir_controller.dir_get_page);

// GET vue upload page
router.get('/:dir/upload', dir_controller.dir_upload_get_page);

// POST vue upload page
router.post('/:dir/upload', upload.single('file'), dir_controller.dir_upload_post_page);