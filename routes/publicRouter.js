'use strict';

const router = require('express').Router();
const auth = require('../lib/utils/database/dbManager').auth;
const public_controller = require('../controllers/publicController');


module.exports = router;

router.get('/', public_controller.index);

router.get('/upload', public_controller.upload_get);

router.post('/upload', auth, public_controller.upload_post);