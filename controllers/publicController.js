'use strict';

const record = require('../lib/utils/record/record');
const DirPageBuilder = require('../lib/utils/builder/dirPageBuilder');
const UploadPageBuilder = require('../lib/utils/builder/uploadPageBuilder');
const multer = require('multer');
const path = require('path');

// Multer Config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => next(null, path.resolve('./public' + req.baseUrl)),
    filename: (req, file, next) => next(null, file.originalname)
  })
});

exports.index = (req, res) => {
  DirPageBuilder(req, res);
};

exports.upload_get = (req, res) => {
  UploadPageBuilder(req, res);
}

exports.upload_post = upload.single('file'), (req, res) => {
  record(`Upload : "${req.file.originalname}" vers "${req.file.destination}"`);
  res.redirect(req.baseUrl);
}