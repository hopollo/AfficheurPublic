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
  } catch (error) { throw err }
}

exports.auth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token) return res.status(401).send("Access refusé. token incorrect."), record(`Database : Auth "Wrong Token" -> ERROR`);
  const credentials = {'name': req.headers.authorization.split('|')[0], 'pass': req.headers.authorization.split('|')[1] }

  try {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      const users = db.db().collection('users');
      //TODO (HoPollo) : Add missings proper res.status;
      users.findOne(credentials, (err, item) => {
        if (err) throw err, record(`DataBase: Auth -> INTERNAL_ERROR`);
        if (!item) return record(`DataBase: Auth "${credentials.name}" -> DENIED`);
        if (item) record(`DataBase: Auth "${item.name}" -> GRANTED`);
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