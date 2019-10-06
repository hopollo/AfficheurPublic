'use strict';

const MongoClient = require('mongodb').MongoClient;
const record = require('../record/record');

const url = 'mongodb://localhost:27017/afficheurdb';

exports.connect = () => {
  try {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      record('Database : Connexion -> Success');
      
      db.close();
    });
  } catch (error) { throw err; }
}

exports.auth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token) return res.status(401).send("Access refusé. token incorrect."), record(`Database : Auth "Wrong Token" -> ERROR`);
  const credentials = {'name': req.headers.authorization.split('|')[0], 'pass': req.headers.authorization.split('|')[1] }
  const currentFolder = req.baseUrl.split('/')[1];

  try {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err, record(`DataBase: Auth -> INTERNAL_ERROR`);
      const users = db.db().collection('users');

      users.findOne(credentials, (err, item) => {
        if (err) throw err, res.status(500), record(`DataBase: Auth -> INTERNAL_ERROR`);
        if (!item) return res.status(403), record(`DataBase: Auth "${credentials.name}" -> DENIED`);
        if (item) res.status(202), record(`DataBase: Auth "${item.name}" -> GRANTED`);
        // ISSUE (HoPollo) : I cannot manage to allow '*' OR 'same folder' access idk why, "|| !item.access.includes('*')"
        if (!item.access.includes(currentFolder)) return res.status(401).send("Permissions insuffisantes pour ce dossier"),
                                                         record(`UPLOAD : "${item.name}" to "${req.baseUrl}" -> NOT_ALLOWED`);
        res.status(200).send('Transferts en cours...'), record(`UPLOAD : "${item.name}" to "${req.baseUrl}" -> ALLOWED`);
        next();
      });
  
      db.close();
    });
  } catch (err) { throw err; }
}

exports.createEntry = (data) => {
  try {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      
      const users = db.db().collection('users');
      users.insertOne(data, (err, res) => {
        if (err) throw err;
        record(`Database: CreateEntry ${data} -> ok`);
      });
  
      db.close();
    });
  } catch (error) { throw err; } 
}

exports.updateEntry = (data) => {
  return 'Feature not implemented yet';
}

exports.dropEntry = (data) => {
  return 'Feature not implemented yet';
}