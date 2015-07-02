/*
@license
  Copyright (c) 2015 Samuel LESPES CARDILLO. All rights reserved.
@author
  Samuel LESPES CARDILLO
  https://www.facebook.com/samuel.cardillo.5
  https://twitter.com/cyberwarfighte1
  https://github.com/samuelcardillo
*/

(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  var backendUrl = "http://127.0.0.1:1338/api";

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    var ironAjax = document.querySelector("iron-ajax");
    app.data = [["Date","Prix"]];
    app.alreadyInit = false; // Change to true when init datas has been sent
    var arrayData = new Array(app.data);

    // ===== THIS CODE ONLY EXECUTE ITSELF ONCE AFTER THE PAGE IS LOADED
    ironAjax.url = backendUrl + "/getData/" + String(Date()).substr(0,15) ;
    ironAjax.generateRequest();
    // ===== THIS CODE ONLY EXECUTE ITSELF ONCE AFTER THE PAGE IS LOADED

    // ===== THIS CODE ONLY EXECUTE ITSELF EVERY 1 MINUTE (60 000 MS)
    setInterval(function(){
      ironAjax.url = backendUrl + "/getData/";
      ironAjax.generateRequest();
    }, 60000)
    // ===== THIS CODE ONLY EXECUTE ITSELF EVERY 1 MINUTE (60 000 MS)
  })

  // When the iron-ajax fire on-response event
  app.handleResponse = function(response){
    var response = response.detail.response;
    var newArray = new Array();

    if(!app.alreadyInit) {
      for(var k in response) {
        var dateString = response[k]["date"];
        dateString = dateString.substr(11,5);
        newArray = newArray.concat([[dateString,response[k]["price"]]]);
      }
      newArray = app.data.concat(newArray);
      app.alreadyInit = true;
    } else {
      var dateString = response[0]["date"];
      dateString = dateString.substr(11,5);
      newArray = app.data.concat([[dateString,response[0]["price"]]]);
    }
    
    app.data = newArray;
  };

})(document);
