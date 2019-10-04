'use strict';

const HomePageBuilder = require('../lib/utils/builder/homePageBuilder');

exports.index = (req, res) => {
  HomePageBuilder(req, res);
};