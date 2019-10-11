const fs = require('fs');
const record = require('../record/record');

module.exports = HomePageBuilder;

function HomePageBuilder(req, res) {
  const homePage = appRoot + '/index.html';

  fs.readdir(appRoot + '/public', (err, folders) => {
    if (err) throw err;
    Proceed(folders);
  });

  function Proceed(folders) {
    WipeOldIndex();

    folders.forEach(folder => {
      if (folder.includes('.')) return record(`ERROR : /public cannot contain files "${folder}" -> IGNORED`);

      const lineToAdd = `
        <a href="/${folder}" onClick="window.location.replace('/${folder}');">  
        <div style="display: inline-block; text-align: center;">
          <iframe id="inlineFrameExample"
                  width="300"
                  height="200"
                  src="/${folder}">
          </iframe>
          <h1>
            ${folder}</a>
          </h1>
        </div>`;

      WriteHomePage(lineToAdd);
    });
  }

  function WriteHomePage(lineToAdd) {
    fs.writeFile(homePage, lineToAdd, { flag: 'a' }, (err) => {
      if (err) throw err;
      return res.sendFile(homePage);
    });
  }

  function WipeOldIndex() {
    fs.writeFile(homePage, '', (err) => { 
      if (err) throw err;
    });
  }
}