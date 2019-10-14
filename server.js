'use strict';

const http = require('http');
const express = require('express');
const watch = require('node-watch');
const path = require('path');
const publicController = require('./controllers/publicController');
global.appRoot = path.resolve(__dirname);

const config = require('./config.json');
const record = require('./lib/utils/record/record');
const mongo = require('./lib/utils/database/dbManager');
const dbLite = require('./lib/utils/database/dbManagerLite');

const indexRouter = require('./routes/indexRouter');
const aboutRouter = require('./routes/aboutRouter');
const adminRouter = require('./routes/adminRouter');
const publicRouter = require('./routes/publicRouter');

const app = express();
const port = config.server.port || 5000;
const enableMongoDB = config.server.enableMongoDB || false;

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/admin', adminRouter);
app.use('/:dir', publicRouter);

// 404 Route
app.get('*', (req, res) => {
  res.status(404).send("Désolé, cette page n'existe pas ! <a href='/'><button>Sortie</button></a>");
});

// Socketio seems to not work anymore with express only
const server = http.createServer(app);
enableMongoDB ? mongo.connect() : dbLite.connect();
const io = require('socket.io').listen(server);

server.listen(port, () => {
  record(`Serveur opérationnel sur le port : ${port}`);
  record(`Serveur en écoute de modifications fichiers...`);
  record(`Envoi d'un refresh aux clients imminent`);
  
  //wake up already connected clients
  setTimeout(() => {
    sendRefreshToClients();
  }, 20 * 1000);
  
  watch(__dirname + '/public', { recursive: true }, async (event, filename) => {
    record(`Modifications: (${event}) "${filename}"`);
    const page= filename.split('/public/')[1].split('/')[0];
    if (event === 'remove') return publicController.remove(page);
    publicController.build(page);
    sendRefreshToClients();
  });

  function sendRefreshToClients() {
    console.log('Refresh sent to clients');
    io.emit('ContentUpdated');
  };
});

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