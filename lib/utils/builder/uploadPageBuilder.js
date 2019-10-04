'use strict';
const path = require('path');

module.exports = HomePageBuilder;

function HomePageBuilder(req, res) {
  return res.sendFile(path.resolve('./lib/upload.html'));
}