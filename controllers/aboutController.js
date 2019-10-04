'use strict';

const aboutPath = require('path').resolve('./lib/about.html');

exports.index = (req, res) => {
  res.sendFile(aboutPath);
};