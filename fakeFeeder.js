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
var serverPort = 1339;
var mysql = require('mysql');

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
console.log("[I] Feeder started on " + serverPort + "...");

setInterval(function(){
  feedTheMass();
  console.log("[I] Feeding the mass !");
}, 60000);

// ======================= SQL POOL FUNCTIONS ======================= //

/** 
 * feedTheMass
 * Description :
 *   Create a fake data and push it in the database
 */
function feedTheMass(callback) {
  var randomPrice = Math.floor((Math.random() * 100) + 1);

  pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        return callback(false);
      }
      connection.query("INSERT INTO `fakeFeed` VALUES('', '" + randomPrice + "', NOW())"), function(err, rows, fields) {
        connection.release();
        return callback(true);
      };
  });
}