# AfficheurPublic
Afficheur Public propulsé par NodeJS

## TODOs : 
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
