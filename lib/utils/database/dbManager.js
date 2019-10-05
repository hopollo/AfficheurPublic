'use strict';

const MongoClient = require('mongodb').MongoClient;
const record = require('../record/record');

const url = 'mongodb://localhost:27017/afficheurdb';

exports.connect = () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    record('Database : Connexion -> Success');
    
    db.close();
  });
}

exports.createEntry = (data) => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    
    const users = db.db().collection('users');
    users.insertOne(data, (err, res) => {
      if (err) throw err;
      record(`Database: CreateEntry ${data} -> ok`);
    });

    db.close();
  });
}

exports.updateEntry = (data) => {
  return 'Feature not implemented yet';
}

exports.dropEntry = (data) => {
  return 'Feature not implemented yet';
}