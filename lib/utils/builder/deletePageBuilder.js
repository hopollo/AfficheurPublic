'use strict';

const fs = require('fs');

module.exports = DeletePageGetFiles;

function DeletePageGetFiles(req, res) {
  let files = [];
  new Promise((resolve, reject) => {
    fs.readdir(`${appRoot}/public/${req.baseUrl}`, (err, folders) => {
      if (err) reject(err);
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