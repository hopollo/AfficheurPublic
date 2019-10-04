'use strict';
const path = require('path');
const record = require('../lib/utils/record/record');
const DirPageBuilder = require('../lib/utils/builder/dirPageBuilder');
const UploadPageBuilder = require('../lib/utils/builder/uploadPageBuilder');

exports.dir_get_page = (req, res) => {
  DirPageBuilder(req, res);
};

exports.dir_upload_get_page = (req, res) => {
  UploadPageBuilder(req, res);
}

exports.dir_upload_post_page = (req, res) => {
  record(`Upload : "${req.file.originalname}" vers "${req.file.destination}"`);
  res.redirect('/' + req.params.dir + '/');
}