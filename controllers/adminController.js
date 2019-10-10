'use strict';

exports.index = (req, res) => {
  res.sendFile(appRoot + '/lib/admin.html');
};

exports.users_get = (req, res, next) => {
  console.log('users_get')
}

exports.user_post = (req, res, next) => {
  console.log('user_post');
};

exports.user_update = (req, res, next) => {
  console.log('user_update');
};

exports.user_delete = (req, res, next) => {
  console.log('user_delte');
};