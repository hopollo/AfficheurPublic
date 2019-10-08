'use strict';
const fs = require('fs');
const path = require('path');
const record = require('../record/record');

module.exports = DirPageBuilder;

function DirPageBuilder(req, res) {
  const vue = req.baseUrl.split('/')[1];
    
  fs.readdir(path.resolve('./public/'), (err, folders) => {
    if (err) throw err;
    if (folders.includes(vue)) return UpdatePageContent(vue, res);
    res.send(`Vue "${vue}" introuvable ou inexistante, verifiez son orthographe/présence dans "/Public"`);
  });
}

function UpdatePageContent(sourceFolder, responseCallback) {
  const source = path.resolve('./public/' + sourceFolder);
  const target = path.resolve('./views/' + sourceFolder + '.html');
  const skeletonPage = path.resolve('./lib/defaultPageSkeletton.html');

  fs.readdir(source, (err, files) => {
    if (err) responseCallback.send(err);
    if (files.length == 0) return responseCallback.send(`Dossier vide, construction de la page impossible. <a href='/${sourceFolder}/upload'>Envoyer des documents</a>`)

    //Clear the current html of the current page folder
    fs.writeFile(target, '', (err) => { if (err) throw err; });
    
    let filesCompleted = 0;
    
    files.forEach(file => {
      const currentFile = source + '/' + file;

      const readStream = fs.createReadStream(currentFile);
      let fileProgress = 0;

      readStream.on('data', (chunk) => {
        fileProgress += chunk.length;

        fs.stat(currentFile, (err, stats) => {
          if (err) throw err;
          const fileSize = stats.size;

          if (fileProgress != fileSize) return;

          const fileTitle = file.split('.')[0];
          const fileExtension = file.split('.')[1];
          const fileContent = chunk.toString().replace(/(?:\r\n|\r|\n)/g, '<br>');
          let contentToPost;

          switch(fileExtension) {
            case 'pdf':
                contentToPost = `
                  <section>
                    <embed src="${file}">
                  </Section>`;
              break;
            case 'png':
            case 'gif':
            case 'jpg':
            case 'bmp':
                contentToPost = `
                  <section>
                    <img src="${file}">
                    <p>${fileTitle}</p>
                  </section>`;
              break;
            case 'mp4':
            case 'ogg':
            case 'webm':
                contentToPost = `
                <section>
                  <video autoplay loop>
                  <source src="${file}">
                  <track src="${fileTitle}.ttk" kind="subtitles" srclang="fr" label="Français">
                    Ce navigateur ne prend visiblement pas en charge le tag video.
                  </video> 
                </section>`;
              break;
            case 'txt':
              contentToPost = `
                <section>
                  <h1>${fileTitle}</h1>
                  <p>${fileContent}</p>
                </section>`;
                break;
            default:
                record(`Builder : Incorrect file extention "${fileTitle}" (${fileExtension}) -> IGNORED`);          
          }

          fs.appendFile(target, contentToPost, (err) => { 
            if (err) throw err;

            filesCompleted += 1;

            if (filesCompleted == files.length) {
              // all is ready reimplement back the default old versions style
              fs.readFile(skeletonPage, 'utf8', (err, data) => {
                if (err) throw err;

                fs.appendFile(target, data, (err) => {
                  if (err) throw err;
                  return responseCallback.sendFile(target);
                });
              });
            }
          });
        });
      });
    });
  });
}