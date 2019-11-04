'use strict';

const fs = require('fs');
const record = require('../record/record');
const url = appRoot + '/data/afficheurdb.json';

function isValidBody(body) {
  return body.name && body.name.toString().trim()   !== '' &&
         body.pass && body.pass.toString().trim()   !== '' &&
         body.access && body.pass.toString().trim() !== '';
}

exports.connect = () => {
  try {
    fs.readFile(url, (err, data) => {
      if (err) throw err;
      if (!data) return record('Database (Lite): Warning your database is empty -> Connected');
      return record('Database (Lite): Connexion -> Success');
    });
  } catch (error) { record(err); }
}

exports.auth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization;
  if (!token) return res.status(401).send("Access refusé. token incorrect."), record(`Database : Auth "Wrong Token" -> ERROR`);
  const credentials = {"name": req.headers.authorization.split('|')[0], "pass": req.headers.authorization.split('|')[1]};
  const currentFolder = req.baseUrl.substr(1);

  try {
    fs.readFile(url, (err, users) => {
      if (err) throw err, res.status(500).send(`Erreur interne, veuillez réesayer plus tard ou contacter votre administrateur`), record(`DataBase: Auth -> INTERNAL_ERROR`);
      if (!users) record('Database (Lite) : Warning your database is empty -> STOPPED');

      const user = JSON.parse(users).filter(d => d.name === credentials.name)
                        .filter(d => d.pass === credentials.pass)[0];
      
      if (!user) 
        return res.status(403).send("Accès refusé"), 
               record(`DataBase (Lite): Auth "${credentials.name}" -> DENIED`);
      
      if (user) 
        res.status(202), 
        record(`DataBase (Lite): Auth "${credentials.name}" to ${req.baseUrl} -> GRANTED`);
      
      if (!user.access.includes('*') && !user.access.includes(currentFolder)) 
        return res.status(401).send("Permissions insuffisantes dans ce dossier"),
               record(`DataBase (Lite): "${user.name}" to "${req.baseUrl}" -> NOT_ENOUGHT_PERMISSIONS`);
      
      res.status(200);
      record(`DataBase (Lite): "${credentials.name}" to "${req.baseUrl}" -> ALLOWED`);
      next();
    });
  } catch (err) { record(err); }
}

exports.getEntries = (req, res, next) => {
  try {
    fs.readFile(url, 'utf8', (err, users) => {
      if (err) throw err;
      if (!users) return res.status(444).send(`Aucuns utilisateurs trouvés, veuillez en creer et ressayer`);
      // TODO: (HoPollo): Remove password from json response
      res.status(200).json(JSON.parse(users));

      next();
    });
  } catch (error) { record(err); }
}

exports.createEntry = (req, res, next) => {
  // TODO (HoPollo) : add toString security to prevent db injections

  fs.readFile(url, function (err, data) {
    let json = JSON.parse(data)
    json.push(req.body)

    fs.writeFile(url, JSON.stringify(json), (err) => {
      if (err)
        return res.status(500).send(err),
               record('Database (Lite) : ERROR while creating new User -> STOPPED');
      return res.status(200).send(`User "${req.body.name}" added ! <a href='/'><button>Sortie</button></a>`);
    })
  });
}

exports.updateEntry = (req, res, next) => {
  /*
  const userToUpdate = {
    name : req.body.name.replace(/"/g,""),
    pass : req.body.pass.replace(/"/g, ""),
    access: req.body.access.replace(/"/g,"")
  };

  fs.readFile(url, 'utf8', (err, data) => {
    if (err)
      return res.status(500).send(err), 
             record(`Database (Lite): UpdateEntry : ${err}`);
    if (!data) 
      return res.status(444).send('Update impossible, la base est vide.');
             record('Database (Lite) : Update impossible base vide -> STOPPED');
    
    const user = JSON.parse(data).filter(d => d.name === userToUpdate.name)
                                 .filter(d => d.pass === userToUpdate.pass)[0];
  });
  */
}

exports.dropEntry = (req, res, next) => {
  //if (!isValidBody(req.body)) return record(`Database (Lite): DropEntry, Invalid Body Request -> REJECTED`);
  console.log('DropEntry called');
  console.log(req.body.name);
  console.log(req.body.access);
  console.log(req.body);
  /*
  fs.readFile(url, (err, data) => {
    if (err) res.status(500).send(err),
             record('Database (Lite) : DropEntry' + err);

    const user = data.filter(d => d.name === req.body.name)
                     .filter(d => d.access === req.body.access);
  });
  */
}