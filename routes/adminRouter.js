'use strict';

const router = require('express').Router();

const admin_controller = require('../controllers/adminController');
const auth = require('../lib/utils/database/dbManager');

module.exports = router;

router.get('/', admin_controller.index);

router.get('/users', auth.auth, auth.getEntries, admin_controller.users_get);

/*
router.post('/user', auth.createEntry, admin_controller.user_post);

router.update('/user', auth.updateEntry, admin_controller.user_update);

router.delete('/user', auth.dropEntry, admin_controller.user_delete);
*/
