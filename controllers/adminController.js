'use strict';

const adminPath = require('path').resolve('./lib/admin.html');

exports.index = (req, res) => {
  res.sendFile(adminPath);
};