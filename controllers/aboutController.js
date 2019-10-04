'use strict';

const path = require('path');

exports.index = (req, res) => {
  res.sendFile(path.resolve('./lib/about.html'));
};