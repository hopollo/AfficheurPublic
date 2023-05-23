'use strict';

module.exports = HomePageBuilder;

function HomePageBuilder(req, res) {
  return res.sendFile(appRoot, 'lib', 'upload.html');
}