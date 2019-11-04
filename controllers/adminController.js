'use strict';

const record = require('../lib/utils/record/record');
const fs = require('fs');

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

exports.logs_get = (req, res) => {
  console.log('logs_get');
  res.send('THERE IS SERVERS LOGS');
};

exports.views_get = (req, res) => {
  console.log('views_get');
  try {
    fs.readdir(appRoot + '/views', (err, views) => {
      if (err) throw err;
      if (!views) return;
      let viewsList = [];
      let i = views.length;
      views.forEach(view => {
        if (!view.includes('.html')) return i--;
        
        new Promise((resolve, reject) => {
          fs.stat(appRoot + '/views/' + view, (err, stat) => {
            if (err) reject(err);

            function formatFileSize(bytes, decimalPoint) {
              if(bytes == 0) return '0 Bytes';
              var k = 1000,
                  dm = decimalPoint || 1,
                  sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                  i = Math.floor(Math.log(bytes) / Math.log(k));
              return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }

            const viewElement = {title: view.split('.')[0], 
                                 size: formatFileSize(stat.size),
                                 date: stat.birthtime}
            resolve(viewElement);
          });
        })
        .then(viewElement => {
          i--;
          viewsList.push(viewElement);
          if (i === 0) return res.json(viewsList);
        });
      });
    });
  } catch (err) { record(err); }
};