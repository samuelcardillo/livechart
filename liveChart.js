/**
  @license
    Copyright (c) 2015 Samuel LESPES CARDILLO. All rights reserved.
  @author
    Samuel LESPES CARDILLO
    https://www.facebook.com/samuel.cardillo.5
    https://twitter.com/cyberwarfighte1
    https://github.com/samuelcardillo
**/

// Including and starting all inclusions
var serverPort = 1338;
var express = require("express");
var app = express()
  , bodyParser = require('body-parser')
  , server = require('http').createServer(app)
  , mysql = require('mysql');
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); 

app.use(function(req,res,next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

var pool  =   mysql.createPool({
  connectionLimit : 100, //important
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fakeData',
  debug    :  false,
})

console.log("######################################");
console.log("# Live Chart System");
console.log("# By @cyberwarfighte1 (Samuel LESPES CARDILLO)");
console.log("######################################");
console.log("[I] Socket.IO server started on port " + serverPort + "...");

server.listen(serverPort);

var localDatabase = new Array();
getFullDatabase(function(data){
  console.log("[I] Database fully loaded...");
});

// ======================= SQL POOL FUNCTIONS ======================= //

/** 
 * getFullDatabase
 * Description :
 *    Populate the variable localDatabase in order to be able to handle fast queries
 */

function getFullDatabase(callback) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        return callback(new Error({"code" : 100, "status" : "Error in connection database"}));
      } 

      connection.query("SELECT * FROM `fakeFeed`", function(err, rows, fields) {
        connection.release();
        if(err) return callback(new Error('something bad happened'));

        for(var k in rows) {
          var day = String(rows[k]["date"]).substr(0,15);
          
          if(!localDatabase[day]) localDatabase[day] = new Array();
          localDatabase[day].push(rows[k]);
        }

        return callback(localDatabase);
      });
  });
}
/** 
 * getLastEntry
 * Description :
 *    Send the last entry from the database
 */
function getLastEntry(callback) {
  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        return callback(new Error({"code" : 100, "status" : "Error in connection database"}));
      } 

      connection.query("SELECT * FROM `fakeFeed` ORDER BY `id` DESC LIMIT 1", function(err, rows, fields) {
        connection.release();
        if(err) return callback(new Error('something bad happened'));

        // Adding the last entry in the localDatabase variable
        var day = String(rows[0]["date"]).substr(0,15);
        if(!localDatabase[day]) localDatabase[day] = new Array();
        localDatabase[day].push(rows[0]);

        return callback(rows);
      });
  });
}



// ======================= EXPRESS ROUTE ======================= //

app.get("/api/getData/:date?",function(req,res){
  if(req.params.date) {
    if(!localDatabase[req.params.date]) return res.end("Date doesn't match");
    res.end(JSON.stringify(localDatabase[req.params.date]));
  } else {
    getLastEntry(function(data){
      res.end(JSON.stringify(data));
      console.log("[I] Last entry sent to the chart...");
    })
  }
})