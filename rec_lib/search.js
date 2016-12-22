'use strict';
var querystring = require('querystring');
var request   = require('sync-request');
var Cylon = require("cylon");

exports.google = function(data){
  var a = {q: data};
  a=querystring.stringify(a);
  var res = request('GET',"https://www.googleapis.com/customsearch/v1?key=AIzaSyDGqs2y8y4wDDh9g3HJ6qjFqx5TnnXOvtg&cx=007223238441648809893:nme6hsyatvg&q="+a+"&hl=pl&lr=lang_pl");
  var response = JSON.parse(res.getBody('utf8'));
  var text = "";
  var message = new Array();
  for (var i = 0; i < response.items.length; i++) {
    message.push(response.items[i].title+'\n'+
    response.items[i].snippet+"\n"+
    response.items[i].link+"\n");
    text+=response.items[i].title+' <break time="1000ms"/>';
  }

  /*request({
    url: "https://www.googleapis.com/customsearch/v1?key=AIzaSyDGqs2y8y4wDDh9g3HJ6qjFqx5TnnXOvtg&cx=007223238441648809893:nme6hsyatvg&q="+a+"&hl=pl&lr=lang_pl",
    json: true
  }, function(error, response, body){
    if (!error && response.statusCode === 200) {
      var text="";
      var message= new Array();
      for(var i=0; i<body.items.length; i++){
        message.push(body.items[i].title+'\n'+
        body.items[i].snippet+"\n"+
        body.items[i].link+"\n");
        text+=body.items[i].title+' <break time="1000ms"/>';
      }*/
      /*
      if(speech==true){
        Cylon.robot({
             connections: {
                 speech: { adaptor: "speech"}
             },
             devices: {
                 voice: { driver: "speech",
                          voice: 'pl-f1',
                          speed: 120
                         }
             },
             work: function(my){
                     my.voice.say(text);
                 }
         }).start();
      }*/
    /*  return [message, text];
    }else {
      return false;
    }
  });*/
  return [message,text];
};

exports.wikipedia = function(data){
  var a = {srsearch: data};
  a=querystring.stringify(a);
  var res = request('GET',"http://pl.wikipedia.org/w/api.php?action=query&format=json&uselang=pl&list=search&utf8=1&"+a);
  var response = JSON.parse(res.getBody('utf8'));
  var text=[response.query.search[0].snippet.toString("utf8").replace(/<[a-z|\ |\=|\"]*>|<\/[a-z]*>/ig,"")];
  return [text,text[0]];
  /*request({
      url: "http://pl.wikipedia.org/w/api.php?action=query&format=json&uselang=pl&list=search&utf8=1&"+a,
      json: true
  }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var text=  body.query.search[0].snippet.toString("utf8").replace(/<[a-z|\ |\=|\"]*>|<\/[a-z]*>/ig,"");
        return [text,text];
      }else{
        return false;
      }
  });*/

};


exports.start=function(question,speech){
    var resp = [];
    var text ="";
    console.log(question);
    if(question.search(/^(szukaj|znajdź)/i)!= -1){
      text=question.replace(/^(szukaj|znajdź)/i,"");
      resp = exports.google(text);
    }else if(question.search(/^(co to jest)/i)!= -1){
      text=question.replace(/^(co to jest?)/i,"");
      resp = exports.wikipedia(text);
    }
    if(speech==true){
      Cylon.robot({
           connections: {
               speech: { adaptor: "speech"}
           },
           devices: {
               voice: { driver: "speech",
                        voice: 'pl-f1',
                        speed: 120
                       }
           },
           work: function(my){
                   my.voice.say(resp[1]);
               }
       }).start();
    }
    return resp[0];
};
