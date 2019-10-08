'use strict';

const fs = require('fs');
const path = require('path');
const record = require('../record/record');

const url = path.resolve('./data/afficheurdb.json');

exports.connect = () => {
  try {
    fs.readFile(url, (err, data) => {
      if (err) throw err;
      record('Database (Lite): Connexion -> Success');
    });
  } catch (error) { throw err; }
}

exports.auth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token) return res.status(401).send("Access refusé. token incorrect."), record(`Database : Auth "Wrong Token" -> ERROR`);
  const credentials = {"name": req.headers.authorization.split('|')[0], "pass": req.headers.authorization.split('|')[1]};
  const currentFolder = req.baseUrl.split('/')[1];

  try {
    fs.readFile(url, (err, users) => {
      if (err) throw err, res.status(500).send(`Erreur interne, veuillez réesayer plus tard ou contacter votre administrateur`), record(`DataBase: Auth -> INTERNAL_ERROR`);
      
      users = JSON.parse(users);

      const user = users.filter(d => d.name === credentials.name)
                        .filter(d => d.pass === credentials.pass);

      if (!user.length) return res.status(403).send(`Accès refusé`), record(`DataBase (Lite): Auth "${credentials.name}" -> DENIED`);
      if (users.length) res.status(202), record(`DataBase (Lite): Auth "${credentials.name}" to ${req.baseUrl} -> GRANTED`);
      
      if (!user[0].access.includes('*')) {
        if (!user[0].access.includes(currentFolder)) return res.status(401).send("Permissions insuffisantes dans ce dossier"),
        record(`DataBase (Lite): "${user.name}" to "${req.baseUrl}" -> NOT_ALLOWED_NO_PERMISSIONS`);
      }
      
      res.status(200);
      record(`DataBase (Lite): "${credentials.name}" to "${req.baseUrl}" -> ALLOWED`);
      next();
    });
  } catch (err) { throw err; }
}

exports.getEntries = (req, res, next) => {
  try {
    fs.readFile(url, (err, users) => {
      if (err) throw err;
      record('Database (Lite): Connexion -> Success');
      if (!users) return res.status(444).send(`Aucuns utilisateurs trouvés, veuillez en creer et ressayer`);
      res.status(200).send(users);

      next();
    });
  } catch (error) { throw err; }
}

exports.createEntry = (data) => {
  return 'Feature not implemented yet';
}

exports.updateEntry = (data) => {
  return 'Feature not implemented yet';
}

exports.dropEntry = (data) => {
  return 'Feature not implemented yet';
}