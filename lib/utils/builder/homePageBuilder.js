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
    let i = folders.length;
    folders.forEach(folder => {
      i--;
      if (folder.includes('.')) return record(`ERROR : /public cannot contain file "${folder}" -> IGNORED`);
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
      if (i === 0) WriteHopePageSupplements();
    });
  }

  function WriteHomePage(lineToAdd) {
    fs.writeFile(homePage, lineToAdd, { flag: 'a' }, (err) => {
      if (err) return record(err);
    });
  }

  function WriteHopePageSupplements() {
    const supplements = 
    `
    <style>#homePageControls {position: fixed; right: 0; bottom: 0;}</style>
    <div id="homePageControls">
      <a href="/about"><button>?</button></a>
      <a href="/admin"><button>⚙</button></a>
    </div>
    <script>
      //Auto NightMode
      setInterval(() => {
        const time = new Date();
        if (time.getHours() > 18) {
          document.querySelector('body').style.background = "black";
          document.querySelector('body').style.color = "white";
        } else {
          document.querySelector('body').style.background = "white";
          document.querySelector('body').style.color = "black";
        }
      }, 60 * 60 * 1000);
    </script>
    `
    fs.writeFile(homePage, supplements, {flag: 'a'}, (err) => {
      if (err) return record(err);
      return res.sendFile(homePage);
    })
  }

  function WipeOldIndex() {
    fs.writeFile(homePage, '', (err) => { 
      if (err) throw err;
    });
  }
}