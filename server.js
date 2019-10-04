'use strict';
require('dotenv').config();
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const express = require('express');
const watch = require('node-watch');

const record = require('./lib/utils/record/record');

const indexRouter = require('./routes/index');

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use('/', indexRouter);

app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(express.json());

// Static files Config
app.use(express.static('public/'));
app.use(express.static('lib/'));
app.use(express.static('routes/'));


// Socketio seems to not work anymore with express only
const server = http.createServer(app);
const io = require('socket.io').listen(server);

server.listen(port, () => {
  record(`Serveur opérationnel sur le port : ${port}`);
  record(`Serveur en écoute de modifications fichiers...`);

  watch(__dirname + '/public', { recursive: true }, (event, filename) => {
    record(`Modifications: (${event}) "${filename}"`);
    sendRefreshToClients();
  });

  function sendRefreshToClients() {
    console.log('Refresh envoyé aux clients');
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