'use strict';

require('dotenv').config();
const http = require('http');
const express = require('express');
const watch = require('node-watch');

const record = require('./lib/utils/record/record');

const indexRouter = require('./routes/indexRouter');
const aboutRouter = require('./routes/aboutRouter');
const adminRouter = require('./routes/adminRouter');
const publicRouter = require('./routes/publicRouter');

const app = express();
const port = process.env.SERVER_PORT || 5000;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/lib'));

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/admin', adminRouter);
app.use('/:dir', publicRouter);


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