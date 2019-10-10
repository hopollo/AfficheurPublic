'use strict';

const record = require('../lib/utils/record/record');
const DirPageBuilder = require('../lib/utils/builder/dirPageBuilder');
const UploadPageBuilder = require('../lib/utils/builder/uploadPageBuilder');
const DeletePageGetFiles = require('../lib/utils/builder/deletePageBuilder');
const fs = require('fs');

exports.index = (req, res) => {
  DirPageBuilder(req, res);
};

exports.upload_get = (req, res) => {
  UploadPageBuilder(req, res);
}

exports.upload_put = (req, res, next) => {
  //TODO (HoPollo): Maybe display each items on a list
  res.json(`${req.files.length} Fichier(s) traité(s) !`);
};

exports.delete_get = (req, res) => {
  res.sendFile(appRoot + '/lib/delete.html');
}

exports.delete_files_get = (req, res) => {
  DeletePageGetFiles(req, res);
}

exports.delete_delete = (req, res, next) => {
  const fileToRemove = req.body.fileToRemove;
  fs.unlink(`${appRoot}/public/${req.baseUrl}/${fileToRemove}`, (err, next) => {
    if (err) console.error(err);
    res.json(`${fileToRemove} supprimé !`);
  });
}