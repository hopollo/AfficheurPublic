'use strict';

const router = require('express').Router();

const about_controller = require('../controllers/aboutController');

module.exports = router;

router.get('/', about_controller.index);

router.get('/version', about_controller.version_get);