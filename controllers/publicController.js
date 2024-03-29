'use strict';

const record = require('../lib/utils/record/record');
const fs = require('fs');
const DirPageBuilder = require('../lib/utils/builder/dirPageBuilder');
const UploadPageBuilder = require('../lib/utils/builder/uploadPageBuilder');
const DeletePageGetFiles = require('../lib/utils/builder/deletePageBuilder');
const path = require('path');

exports.build = (view) => {
  DirPageBuilder(view);
}

exports.remove = (view) => {
  fs.unlink(appRoot + `/views/${view}.html`, (err) => {
    if (err) return record(`ERROR : ${err}`);
    return record(`View : ${view}.html => REMOVED`);
  });
}

exports.index = (req, res) => {
  const file = req.baseUrl.substr(1);
  const view = path.join(appRoot, 'views', `${file}.html`);
  if (!view) return record(`ERROR : "${view}" is not a proper an html element -> STOPPED`);
  // ISSUE : Conflic with existing page, routes
  res.sendFile(view, (err) => {
    if (err) return res.status(500).send("Désolé, redirection impossible !");
  });
};

exports.upload_get = (req, res) => {
  UploadPageBuilder(req, res);
}

exports.upload_put = (req, res) => {
  //TODO (HoPollo): Maybe display each items on a list
  res.json(`${req.files.length} Fichier(s) traité(s) !`);
};

exports.delete_get = (req, res) => {
  res.sendFile(path.join(appRoot, 'lib', 'delete.html'));
}

exports.delete_files_get = (req, res) => {
  DeletePageGetFiles(req, res);
}

exports.delete_delete = (req, res, next) => {
  const fileToRemove = req.body.fileToRemove;
  fs.unlink(path.join(appRoot, 'public', req.baseUrl, fileToRemove), (err) => {
    if (err) console.error(err);
    res.json(`${fileToRemove} supprimé !`);
  });
}