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

## TODOs : ***this section is ugly to see from github but not from the IDE (you don't need this anyway until you contribute to the code itself)***
/lib/upload.html
  [] display uploaded files as a list in res.json message
  [] hide sendButton when already logged-in
/lib/delete.html
  [] fix duplicating files div
  [] block sendbutton when already logged-in
  [] display file infos (creator, date) on file mousehover
/lib/admin.html
  [] build page
  [] display server uptime
  [] display logs
    [] filter logs
  [] display nodejs console
    [] allow direct inputs
  [] add users overviews
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
