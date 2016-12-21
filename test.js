var rec = require('node-record-lpcm16')
var request = require('request')

var witToken = "H3RQCF2SI746LFSS3ZKIPJVCSDLM2XYH";

exports.parseResult = function (err, resp, body) {
  console.log(body)
}

rec.start().pipe(request.post({
  'url'     : 'https://api.wit.ai/speech?v=20160526',
  'headers' : {
    'Accept'        : 'application/vnd.wit.20160202+json',
    'Authorization' : 'Bearer ' + witToken,
    'Content-Type'  : 'audio/wav'
  }
}, exports.parseResult));
