var express = require('express');
var router = express.Router();
var wit = require('node-wit');
var rec= require('node-record-lpcm16');
var request   = require('request');

var ACCESS_TOKEN = "H3RQCF2SI746LFSS3ZKIPJVCSDLM2XYH";

wit.captureTextIntent(ACCESS_TOKEN, "test", function (err, res) {
    console.log("Response from Wit for text input: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {  });
});

router.post('/', function(req,res){
  console.log(req.body.rec);
  var message="";

  exports.parseResults = function(err,resp,body){
    var message= JSON.parse(body);
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
  }

/*stop nagrywania wysłanie do wit.ai i uruchomienie funkcji parseResults*/
  if(req.body.rec=='off'){
    rec.stop().pipe(request.post({
      'url':'https://api.wit.ai/speech?v=20160526',
      'headers':{
                'Accept'        : 'application/vnd.wit.20160202+json',
                'Authorization' : 'Bearer ' + ACCESS_TOKEN,
                'Content-Type'  : 'audio/wav'
                }
    },exports.parseResults));
  }
});

module.exports = router;
