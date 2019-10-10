'use strict';
const fs = require('fs');
const path = require('path');
const record = require('../record/record');

module.exports = DirPageBuilder;

function DirPageBuilder(req, res) {
  const vue = req.baseUrl.replace('/','');
    
  fs.readdir(appRoot + '/public/', (err, folders) => {
    if (err) record(`ERROR : ${err}`);
    if (folders.includes(vue)) return UpdatePageContent(vue, res);
    res.send(`Vue "${vue}" introuvable ou inexistante, verifiez son orthographe/présence dans "/Public"`);
  });
}

function UpdatePageContent(sourceFolder, res) {
  const source = appRoot + '/public/' + sourceFolder;
  const target = appRoot + '/views/' + sourceFolder + '.html';
  const skeletonPage = appRoot + '/lib/defaultPageSkeletton.html';
  
  GetDirContent(source);

  function GetDirContent(source) {
    fs.readdir(source, (err, files)=> {
      if (err) record(`ERROR : ${err}`);
      if (!files.length) return res.send(`Dossier vide, construction de la page impossible. <a href='/${sourceFolder}/upload'>Envoyer des documents</a>`);    
      return GetFilesContent(files);
    });
  }
  
  function GetFilesContent(files) {
    WipeOldTarget(target);
    let filesDone = 0;
    files.forEach(file => {
      fs.readFile(source + '/' + file, 'utf8', (err, data) => {
        if (err) console.log(err); // Avoid folder in views construction
        const cookedData = ProcessData(file, data);
        AppendDataToTarget(cookedData, target);
        filesDone++;
        if (filesDone === files.length) return GetSkeletonData(skeletonPage);
      });
    });
  }

  function WipeOldTarget(source) {
    fs.writeFile(target, '', (err) => { if (err) record(`ERROR : ${err}`); });
  }

  function AppendDataToTarget(data, target) {
    fs.appendFile(target, data, (err) => { 
      if (err) record(`ERROR : ${err}`);
    });
  }

  function GetSkeletonData(skeletonPage) {
    fs.readFile(skeletonPage, 'utf8', (err, data) => {
      if (err) record(`ERROR : ${err}`);
      AppendSkeletonToTarget(data, target);
    });
  }

  function AppendSkeletonToTarget(data, target) {
    fs.appendFile(target, data, (err) => { 
      if (err) record(`ERROR : ${err}`);
      SendFileToClient(target);
    });
  }

  function SendFileToClient(target) {
    res.sendFile(target);
  }

  function ProcessData(file, data) {
    const fileTitle = file.split('.')[0];
    const fileExtension = file.split('.')[1];
    const fileContent = data;
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
          contentToPost = "";       
    }
    return contentToPost;
  }
}