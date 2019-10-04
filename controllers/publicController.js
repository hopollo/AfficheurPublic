'use strict';

const record = require('../lib/utils/record/record');
const DirPageBuilder = require('../lib/utils/builder/dirPageBuilder');
const UploadPageBuilder = require('../lib/utils/builder/uploadPageBuilder');

exports.index = (req, res) => {
  DirPageBuilder(req, res);
};

exports.upload_get = (req, res) => {
  UploadPageBuilder(req, res);
}

exports.upload_post = (req, res) => {
  record(`Upload : "${req.file.originalname}" vers "${req.file.destination}"`);
  res.redirect(req.baseUrl);
}