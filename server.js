'use strict';

require('dotenv').config();
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const express = require('express');
const fs = require('fs');
const watch = require('node-watch');
const MongoClient = require('mongodb');
const record = require('./lib/utils/record/record');

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
const port = process.env.SERVER_PORT || 5000;

// Socketio seems to not work anymore with express only
const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(port, () => {
  record(`Serveur opérationnel sur le port : ${port}`);
  record(`Serveur en écoute de modifications fichiers...`);
  
  //ConnectToDatabase();

  watch(__dirname + '/public', { recursive: true }, () => {
    record('Modifications /public/');
    sendRefreshToClients();
  });

  function sendRefreshToClients() {
    console.log('Refresh envoyé aux clients');
    io.emit('ContentUpdated');
  };
});

// Static files Config
app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/lib/'));
app.use(express.static(__dirname + '/routes/'));

// Sockets Config
let allClients = [];
io.on('connection', (socket) => {
   allClients.push(socket);
   console.log(`Client (${socket.conn.remoteAddress.split('f:')[1]}) => Ecoute (${allClients.length} Total)`);

   socket.on('disconnect', () => {
      const i = allClients.indexOf(socket);
      console.warn(`Client (${allClients[i].conn.remoteAddress.split('f:')[1]}) => Perdu (${allClients.length - 1} Total)`);
      allClients.splice(i, 1);
   });
});

app.get('/', (req, res) => {
  new Promise((resolve, reject) => {
    fs.readdir(__dirname + '/public', (err, folders) => {
      if (err) reject(err);
      resolve(folders);
    });
  })
  .then(folders => {
    fs.writeFile(__dirname + '/index.html', '', (err) => { 
      if (err) reject(err);
    });

    folders.forEach(folder => {
      const lineToAdd = `<h1><a href="/${folder}" onClick="window.location.replace('/${folder}');">${folder}</a></h1>`;
      
      fs.writeFile(__dirname + '/index.html', lineToAdd, { flag: 'a' }, (err) => {
        if (err) reject(err);
        return res.sendFile(__dirname + '/index.html');
      });
    });
  })
  .catch(err => { console.error(err) })
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/lib/about.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/lib/auth/admin.html');
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/:dir', (req, res) => {
  fs.readdir(__dirname+'/public/', (err, folders) => {
    const vue = req.params.dir;
    if (err) throw err;
    if (folders.includes(vue)) return UpdatePageContent(vue, res);
    res.send(`Vue "${vue}" introuvable ou inexistante, verifiez son orthographe/présence dans "/Public"`);
  });
});


/*
app.post('/users', async (req, res) => {
  try {
    const salt;
    const hasedPassword;
    const user = {id: req.body.name, mdp: req.body.password};
    users.push(user);
    res.statusCode(201).send();
  } catch {
    res.statusCode(500).send('Authentification impossible');
  }
});
*/

function UpdatePageContent(sourceFolder, responseCallback) {

  const source = __dirname + '/public/' + sourceFolder;
  const target = __dirname + '/routes/' + sourceFolder + '.html';

  fs.readdir(source, (err, files) => {

    if (err) responseCallback.send(err);
    //if (files.length == 0) return responseCallback.send('Dossier vide, affichage impossible');

    //Clear the current html of the current page folder
    fs.writeFile(target, '', (err) => { if (err) throw err; });
    
    let filesCompleted = 0;
    
    files.forEach(file => {
      const currentFile = source + '/' + file;

      const readStream = fs.createReadStream(currentFile);
      let fileProgress = 0;

      readStream.on('data', (chunk) => {
        fileProgress += chunk.length;

        fs.stat(currentFile, (err, stats) => {
          if (err) throw err;
          const fileSize = stats.size;

          if (fileProgress != fileSize) return;

          const fileTitle = file.split('.')[0];
          const fileExtension = file.split('.')[1];
          const fileContent = chunk.toString().replace(/(?:\r\n|\r|\n)/g, '<br>');
          let contentToPost;

          switch(fileExtension) {
            case 'pdf':
                contentToPost = `
                  <section>
                    <embed src="${file}">
                  </Section>`;
              break;
            case 'png':
            case 'gif':
            case 'jpg':
                contentToPost = `
                  <section>
                    <img src="${file}">
                    <p>${fileTitle}</p>
                  </section>`;
              break;
            case 'mp4':
            case 'ogg':
            case 'webm':
                contentToPost = `
                <section>
                  <video autoplay loop>
                  <source src="${file}">
                  <track src="${fileTitle}.ttk" kind="subtitles" srclang="fr" label="Français">
                    Ce navigateur ne prend visiblement pas en charge le tag video.
                  </video> 
                </section>`;
              break;
            case 'txt':
              contentToPost = `
                <section>
                  <h1>${fileTitle}</h1>
                  <p>${fileContent}</p>
                </section>`;
                break;
            default:
              return;
          }

          fs.appendFile(target, contentToPost, (err) => { 
            if (err) throw err;

            filesCompleted += 1;

            if (filesCompleted == files.length) {
              // all is ready reimplement back the default old versions style
              fs.readFile(__dirname + '/lib/defaultPageSkeletton.html', 'utf8', (err, data) => {
                if (err) throw err;

                fs.appendFile(target, data, (err) => {
                  if (err) throw err;
                  return responseCallback.sendFile(target);
                });
              });
            }
          });
        });
      });
    });
  });
}