'use strict';

const record = require('../lib/utils/record/record');
const fs = require('fs');

exports.index = (req, res) => {
  res.sendFile(appRoot + '/lib/admin.html');
};

exports.menu_get = (req, res, next) => {
  const menu = 
  `<div class="tab">
    <button id="defaultOpen" class="tabLink" onclick="openPage('Users', this, 'red')">Users</button>
    <button class="tabLink" onclick="openPage('Views', this, 'green')">Views</button>
    <button class="tabLink" onclick="openPage('Logs', this, 'blue')">Logs</button>
    <button class="tabLink" onclick="openPage('Terminal', this, 'orange')">Terminal</button>

    <div id="Users" class="tabContent"></div>
    <div id="Views" class="tabContent"></div>
    <div id="Logs" class="tabContent"></div>
    <div id="Terminal" class="tabContent"></div>
  </div>`;
  res.send(menu);
}

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

exports.terminal_get = (req, res) => {
  console.log('terminal_get');
  res.json('Not Implemented yet.');
}

exports.logs_get = (req, res) => {
  console.log('logs_get');
  try {
    fs.readdir(appRoot + '/logs', (err, logs) => {
      if (err) throw err;
      if (!logs) return;
      let logsList = [];
      let i = logs.length;
      logs.forEach(log => {
        if (!log.includes('log')) return i--;
        new Promise((resolve, reject) => {
          fs.stat(appRoot + '/logs/' + log, (err, stat) => {
            if (err) reject(err);

            function formatFileSize(bytes, decimalPoint) {
              if(bytes == 0) return '0 Bytes';
              var k = 1000,
                  dm = decimalPoint || 1,
                  sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                  i = Math.floor(Math.log(bytes) / Math.log(k));
              return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }

            const logElement = {title: log.split('.')[0], 
                                 size: formatFileSize(stat.size),
                                 date: stat.birthtime.toLocaleTimeString()}
            resolve(logElement);
          });
        })
        .then(logElement => {
          i--;
          logsList.push(logElement);
          if (i === 0) return res.json(logsList);
        });
      });
    });
  } catch (err) { record(err); }
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
                                 date: stat.birthtime.toLocaleDateString() + ' (' + stat.birthtime.toLocaleTimeString() + ')'}
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