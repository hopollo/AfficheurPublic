# AfficheurPublic
Afficheur Public propulsé par NodeJS

## What is this ?
This project is meant to display to webclients informations as fullscreened sliders (same as airports big screens ads)  
Each folders inside **"/public"** will result as a **view**. (http://localhost:port/VIEW)  
Each files in a view folder will result as a **dedicated slider** + basic common page skelleton (clock on the bottom)  
**Sockets** are injected in every VIEWS, that means whenever someone upload the view folder all clients will **autorefresh the page right away**.  
Each views can recieve files changes from server manipulation iteself and/or from url (http://localhost:port/VIEW/upload | http://localhost:port/VIEW/delete)  
Each VIEW modification from distance (web url) need to get **authenticated** by the database (afficheurdb) inside mongodb (collection: users)  
Each USER is made from this pattern inside **mongodb** : ({'user':'ChoosenUserID','pass':'ChoosenUserPassword','access':'AdminChooseFolderAccess'})  
(Every users **can get (see) any views** but only **editing it will be restricted**)  

#### /!\ This Project now supports the "Light" mode, it's a local database as json designed for raspberry PI (but potentially less secure) that are not compatible with recent MongoDB versions but this json files will still be compatible with MongoDB database architectures for import/export light to normal if needed.

### Requierments / How to launch this project (With MongoDB) :
***i put here the version i used while building this project, it might work with others versions too***  
1°) Install **NODEJS (v8.10)**, **NPM (v6.11)**, **MONGODB (v4.2)**  
2°) Download & extract this project folder on your machine  
3°) Go to the extracted folder and run ```npm install```  
4°) Run ```mongo```  
5°) Open the **afficheurdb** database with : ```use afficheurdb```  
6°) Open the **users** collection of that database : ```db.createCollection('users')```  
7°) Create a first account with ```db.users.insert({'name':'myName', 'pass':'myPass', 'access':'*'})```   **"*"** means admin privileges, otherwhise use 'access':'viewA,view3,welcomePage' to grand acces to viewA **AND** view3 **AND** welcomePage folders.  
8°) Exit mongo and run on the terminal (inside the extracted folder from earlier) : ```node server``` or ```npm start```  
9°) Edit your starting script to add this server example : (node home/afficheur/server)  
10°) It's ready to go. Enjoy  

### How to launch this project (Without MongoDB) (Raspberri PI) :  
***i put here the version i used while building this project, it might work with others versions too***  
1°) Install **NODEJS (v8.10)**, **NPM (v6.11)**  
2°) Download & extract this project folder on your machine  
3°) Go to the extracted folder and run ```npm install```  
4°) Check the config.json file to disable MongoDB ```server: { "enableMongoDB": false }```  
5°) Open the **/data/afficheurdb.json** and from the example account add yours     
Account patterns should always be like : ```{"name":"myName", "pass":"myPass", "access":"*"}```  
6°) Edit your starting script to add this server example : (node home/afficheur/server)  
7°) It's ready to go. Enjoy

## TODOs : ***this section is ugly to see from github but not from the IDE (you don't need this anyway until you contribute to the code itself)***
/lib/upload.html
  [] display uploaded files as a list in res.json message
  [] hide sendButton when already logged-in
/lib/delete.html
  [] fix duplicating files div
  [] block sendbutton when already logged-in
  [] display file infos (creator, date) on file mousehover
Database
  [] add passwords encryptions
/lib/admin.html
  [X] build page
  [] display server uptime
  [] display logs
    [] filter logs
  [] display nodejs console
    [] allow direct inputs
  [X] add users overviews
    [] allow to edit users
      [] add user
      [] delete user
      [] update user
        [] update user password
        [] upsate user id
        [] update user dir permissions
/lib/about.html
  [] fetch github version.txt and display it on version span
    [] create a download feature to get new files
/lib/database/dbManager.js
  [] add adduser feature
    [] get info and parse then from a model.json template
  [] add updateuser feature
  [] add deleteuser feature
/server.js
  [] cleanup code
    [] remove unecessary calls
    [] add security modules
