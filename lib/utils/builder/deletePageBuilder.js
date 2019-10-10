'use strict';

const fs = require('fs');

module.exports = DeletePageGetFiles;

function DeletePageGetFiles(req, res) {
  let files = [];
  new Promise((resolve, reject) => {
    fs.readdir(appRoot + `/public/${req.baseUrl.substr(1)}`, (err, folders) => {
      if (err) reject(err);
      if (!folders.length) return res.send('Ce dossier ne continent aucuns élements.');
      resolve(folders);
    });
  })
  .then(folders => {
    
    folders.forEach(folder => {
      if (files.length != folders.length) files.push(folder);
    });
  })
  .then(() => {
    res.json(files);
  })
  .catch(err => console.error(err))
}