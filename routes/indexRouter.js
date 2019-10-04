'use strict';

const router = require('express').Router();

const index_controller = require('../controllers/indexController');

module.exports = router;

router.get('/', index_controller.index);