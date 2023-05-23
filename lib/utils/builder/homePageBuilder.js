const fs = require('fs');
const record = require('../record/record');
const path = require('path');

module.exports = HomePageBuilder;

function HomePageBuilder(req, res) {
  let homePageContent = [];

  fs.readdir(path.join(appRoot, 'public'), (err, folders) => {
    if (err) throw err;
    Proceed(folders);
  });

  function Proceed(folders) {
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

      homePageContent.push(lineToAdd);
      if (i === 0) {  
        const homePageControls = `
        <div id="homePageControls">
          <a href="/about"><button>?</button></a>
          <a href="/admin"><button>⚙</button></a>
        </div>
        `;
        homePageContent.push(homePageControls); 
        WriteHomePageSupplementsAndRender();
      }
    });
  }

  function WriteHomePageSupplementsAndRender() {
    const supplementsCss = 
    `
    <style>
      footer {position: absolute; bottom: 0;}
      #homePageControls {position: absolute; right: 0; bottom: 0;}
    </style>
    `;
    const supplementsJS =
    `
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
    `;
    
    return res.render('view', {
      viewName: "Home", 
      viewStyle: supplementsCss, 
      viewContent: homePageContent,
      viewJS: supplementsJS});
  }
}