const record = require('../utils/record/record');
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/afficheurDB";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  record("Base de donée créée!");
  db.close();
});