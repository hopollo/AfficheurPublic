'use strict';
const fs = require('fs');
const path = require('path');

module.exports = Record;

function Record(data) {
  new Promise((resolve, reject) => {
    const logFile =  appRoot + '/logs/';
    let currentDate;
    const time = new Date();
    const message = `[${time.toUTCString()}]: ${data};\n`;

    if (time != currentDate) currentDate = `${time.getDate()}_${time.getMonth()}_${time.getFullYear()}`;

    fs.writeFile(logFile + 'log_' + currentDate, message, {flag: 'a+'}, (err) => {
      if (err) reject(err);
      return console.log(message);
    });
  })
  .catch(err => console.error(err))
}