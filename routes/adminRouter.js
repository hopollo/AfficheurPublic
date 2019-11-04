'use strict';

const router = require('express').Router();
const admin_controller = require('../controllers/adminController');
const enableMongoDB = require('../config.json').server.enableMongoDB;
const auth = require('../lib/utils/database/dbManager');
const authLite = require('../lib/utils/database/dbManagerLite');

module.exports = router;

router.get('/', admin_controller.index);

if (enableMongoDB) router.get('/menu', auth.auth, admin_controller.menu_get);
router.get('/menu', authLite.auth, admin_controller.menu_get);

router.get('/logs', admin_controller.logs_get);
router.get('/views', admin_controller.views_get);
router.get('/terminal', admin_controller.terminal_get);

if (enableMongoDB) router.get('/users', auth.getEntries, admin_controller.users_get);
router.get('/users', authLite.getEntries, admin_controller.users_get);

if (enableMongoDB) router.post('/user', auth.createEntry, admin_controller.user_post);
router.post('/user', authLite.createEntry, admin_controller.user_post);

//router.update('/user', auth.updateEntry, admin_controller.user_update);

if (enableMongoDB) router.delete('/user', auth.dropEntry, admin_controller.user_delete);
router.delete('/user', authLite.dropEntry, admin_controller.user_delete);

