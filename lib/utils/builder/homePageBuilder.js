const fs = require('fs');
const record = require('../record/record');

module.exports = HomePageBuilder;

function HomePageBuilder(req, res) {
  const homePage = appRoot + '/index.html';

  new Promise((resolve, reject) => {
    fs.readdir(appRoot + '/public', (err, folders) => {
      if (err) reject(err);
      resolve(folders);
    });
  })
  .then(folders => {
    fs.writeFile(homePage, '', (err) => { 
      if (err) throw err;
    });

    folders.forEach(folder => {
      const lineToAdd = `<h1><a href="/${folder}" onClick="window.location.replace('/${folder}');">${folder}</a></h1>`;
      
      fs.writeFile(homePage, lineToAdd, { flag: 'a' }, (err) => {
        if (err) throw err;
        return res.sendFile(homePage);
      });
    });
  })
  .catch(err => record(err));
}