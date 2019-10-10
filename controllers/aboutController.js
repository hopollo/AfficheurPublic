'use strict';

const fs = require('fs');
const record = require('../lib/utils/record/record');

const aboutPath = require('path').resolve('./lib/about.html');

exports.index = (req, res) => {
  res.sendFile(aboutPath);
};

exports.version_get = (req, res) => {
  fs.readFile(appRoot + '/version', 'utf8', (err, data) => {
    if (err) return record(err);
    res.send(data);
  })
}