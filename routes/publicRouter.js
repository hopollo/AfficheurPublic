'use strict';

const router = require('express').Router();
const auth = require('../lib/utils/database/dbManager').auth;
const public_controller = require('../controllers/publicController');
const path = require('path');
const multer = require('multer');
const noUpload = multer();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => next(null, path.resolve('./public' + req.baseUrl)),
    filename: (req, file, next) => next(null, file.originalname)
  })
});

module.exports = router;

router.get('/', public_controller.index);

router.get('/upload', public_controller.upload_get);
router.put('/upload', auth, upload.array('files'), public_controller.upload_put);

router.get('/delete', public_controller.delete_get);
router.get('/delete/files', auth, public_controller.delete_files_get);
router.delete('/delete', noUpload.none(), public_controller.delete_delete);