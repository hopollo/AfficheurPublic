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
        if (err) throw err, res.status(500).send(`Erreur interne, veuillez réesayer plus tard ou contacter votre administrateur`), record(`DataBase: Auth -> INTERNAL_ERROR`);
        if (!item) return res.status(403).send(`Accès refusé`), record(`DataBase: Auth "${credentials.name}" -> DENIED`);
        if (item) res.status(202), record(`DataBase: Auth "${item.name}" -> GRANTED`);
        // ISSUE (HoPollo) : I cannot manage to allow '*' OR 'same folder' access idk why, "|| !item.access.includes('*')"
        if (!item.access.includes('*')) {
          if (!item.access.includes(currentFolder)) return res.status(401).json("Permissions insuffisantes dans ce dossier"),
                                                         record(`DataBase : "${item.name}" to "${req.baseUrl}" -> NOT_ALLOWED_NO_PERMISSIONS`);
        }
        res.status(200);
        record(`DataBase : "${item.name}" to "${req.baseUrl}" -> ALLOWED`);
        next();
      });
  
      db.close();
    });
  } catch (err) { throw err; }
}

exports.getEntries = (req, res, next) => {
  try {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) throw err;
      record('Database : Connexion -> Success');
      const usersCollection = db.db().collection('users');
      //ISSUE(HoPollo) Not able to apply hide filters (id, pass) to the response if not using .foreach
      const usersRequest = usersCollection.find({}, {_id: 0, pass:0}).toArray((err, users) => {
        if (err) throw err;
        if (!users) return res.status(444).send(`Aucuns utilisateurs trouvés, veuillez en creer et ressayer`);
        res.status(200).send(users);
      });

      next();

      db.close();
    });
  } catch (error) { throw err; }
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