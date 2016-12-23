/* zrobić wyskakujące okno pogody */
var express = require('express');
var router = express.Router();
var rec= require('node-record-lpcm16');
var request   = require('request');
var search = require('../rec_lib/voice.js');
var request_sync   = require('sync-request');

var ACCESS_TOKEN = "H3RQCF2SI746LFSS3ZKIPJVCSDLM2XYH";
var message="";
var place ="Zator"
var weather = "";
/* GET home page. */
router.get('/', function(req, res) {
  weather = request_sync('GET',"http://api.openweathermap.org/data/2.5/forecast?q="+place+"&appid=a299ed8313ffbd0726396d87ef056d1e");
  weather=JSON.parse(weather.getBody('utf8'));
  console.log(weather.list[0].weather[0].description);
  res.render('index', {  });

});


router.post('/', function(req,res){
  console.log(req.body.rec);


  exports.parseResults = function(err,resp,body){
    message = JSON.parse(body);
  //  console.log(msg._text);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send(JSON.stringify({ msg: message._text} ));
  }
/* start nagrywania po naciśnięciu przycisku*/
  if(req.body.rec=="on"){
    rec.start({
      sampleRate:44100,
      verbose:true
    });
    res.status(200).json({msg: "ok"});
  }else if(req.body.rec=='off'){
    /*stop nagrywania wysłanie do wit.ai i uruchomienie funkcji parseResults*/
    rec.stop().pipe(request.post({
      'url':'https://api.wit.ai/speech?v=20160526',
      'headers':{
                'Accept'        : 'application/vnd.wit.20160202+json',
                'Authorization' : 'Bearer ' + ACCESS_TOKEN,
                'Content-Type'  : 'audio/wav'
                }
    },exports.parseResults));
  }else if (req.body.rec == 'response') {
    var answer=search.start(message._text,true);
    console.log(answer);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send(JSON.stringify({ "answer": answer} ));
  }
});

module.exports = router;
