# Live Chart System

This system was done in a little bit more than 3 hours in order to help a developer. I thought it can help some other people to understand few logics of Polymer and NodeJS librairies... 

## How to use it ?

The code is done to connect itself to a **MySQL database**. 

* Run `bower install && npm install` in order to install dependancies. 
* Import `fakeData.sql` to your database
* Change de connection details in `fakeFeeder.js` and `liveChart.js`

PS : If you happen to change the port of `liveChart.js` , please modify the port in `scripts/app.js` !

### What does it contain ? 

* `fakeData.sql` : Schema of the SQL database
* `fakeFeeder.js` : A simple script that push fake informations in the database for test only
* `liveChart.js`: The script that take informations from the database

### How does it work ? 

When `liveChart.js` is started, it populate the variable `localDatabase` (in order to reduce SQL requests) and ask every minutes for the latest informations (and push it in the same variable). It have an ** `ExpressJS` API ** that send the variable informations through *`/api/getData`* which also work with a specific date (*ex : `/api/getData/Tue Jun 30 2015`*).

When `index.html` is displayed, it directly call `/api/getData/dateHere` in order to get all the entries from the day and then call `/api/getData/` every minutes in order to get the latest entry. 

### What in the future ?

I will probably implement Socket.IO in order to get a REAL real-time displaying and also enable multi-charts displaying. I used Express in order to have an API and because the code had to be done in few hours. 


### Author

* Samuel LESPES CARDILLO
* https://twitter.com/cyberwarfighte1
* https://www.facebook.com/samuel.cardillo.5
* https://github.com/samuelcardillo