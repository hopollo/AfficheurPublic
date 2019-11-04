'use strict';

const router = require('express').Router();
const admin_controller = require('../controllers/adminController');
const enableMongoDB = require('../config.json').server.enableMongoDB;
const auth = require('../lib/utils/database/dbManager');
const authLite = require('../lib/utils/database/dbManagerLite');

module.exports = router;

router.get('/', admin_controller.index);
router.get('/logs', admin_controller.logs_get);
router.get('/views', admin_controller.views_get);

if (enableMongoDB) router.get('/users', auth.auth, auth.getEntries, admin_controller.users_get);
router.get('/users', authLite.auth, authLite.getEntries, admin_controller.users_get);


if (enableMongoDB) router.post('/user', auth.createEntry, admin_controller.user_post);
router.post('/user', authLite.createEntry, admin_controller.user_post);

//router.update('/user', auth.updateEntry, admin_controller.user_update);


if (enableMongoDB) router.delete('/user', auth.dropEntry, admin_controller.user_delete);
router.delete('/user', authLite.dropEntry, admin_controller.user_delete);

