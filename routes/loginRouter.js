'use strict';

const router = require('express').Router();

const admin_controller = require('../controllers/adminController');

module.exports = router;

router.get('/', admin_controller.index);
/*
router.post('/users', admin_controller.post);
router.update('/user', admin_controller.update);
router.delete('/user', admin_controller.delete);
*/