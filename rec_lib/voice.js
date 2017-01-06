/*
dodanie wyrażenie regularnego dla pogody
jaka jest pogoda w poniedziałek
jaka jest pogoda jutro itp.
*/

'use strict';
var querystring = require('querystring');
var request   = require('sync-request');
var Cylon = require("cylon");

var place ="Zator";
var weather_description={
  "clear sky": "czyste niebo",
  "few clouds": "mało chmur",
  "scattered clouds": "częściowe zachmurzenie",
  "broken clouds": "pochmurnie",
  "shower rain": "delikatny deszcz",
  "rain": "deszczowo",
  "thunderstorm":"burzowo",
  "snow": "śnieg",
  "mist": "mgła",
}


function weatherDay (day,weather){
  var response = new Array();
  for (let i = 0; i < weather.list.length; i++) {
    var date = new Date(weather.list[i].dt_txt);
    if(date.getDate() == day){
      response.push(weather.list[i]);
    }
  };
  return response;
}

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
  return [["google",message],text];
};

exports.wikipedia = function(data){
  var a = {srsearch: data};
  a=querystring.stringify(a);
  var res = request('GET',"http://pl.wikipedia.org/w/api.php?action=query&format=json&uselang=pl&list=search&utf8=1&"+a);
  var response = JSON.parse(res.getBody('utf8'));
  var text=[response.query.search[0].snippet.toString("utf8").replace(/<[a-z|\ |\=|\"]*>|<\/[a-z]*>/ig,"")];
  return [["wikipedia",text],text[0]];
};

exports.weather = function(text){
  if(text.search(/^(jaka (jest|będzie)) (((teraz|dzisiaj|dziś) pogoda)|pogoda)$/i) != -1){
    var weather = request('GET',"http://api.openweathermap.org/data/2.5/weather?q="+place+"&appid=a299ed8313ffbd0726396d87ef056d1e");
    weather=JSON.parse(weather.getBody('utf8'));

    var text = "Jest "+weather_description[weather.weather[0].description]+". Temperatura wynosi "+
    (Math.round((parseFloat(weather.main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
    weather.main.pressure+" hektopaskali, a wilgotność:  "+weather.main.humidity+" procent. Prędkość wiatru: "+weather.wind.speed+" metrów na sekundę";

    weather =[ "Temperatura wynosi: "+(Math.round((parseFloat(weather.main.temp)-273.15) * 100) / 100)+"°C \n Ciśnienie: "+
    weather.main.pressure+" hPa \n Wilgotność: "+weather.main.humidity+"% \n Prędkość wiatru: "+ weather.wind.speed+"m/s" ];

    return [["pogoda_teraz",weather],text];
  }else{
    text = text.replace(/^(jaka (jest|będzie) )/i,"");
    text = text.replace(/ pogoda$/i,"");

    var weather = request('GET',"http://api.openweathermap.org/data/2.5/forecast?q="+place+"&appid=a299ed8313ffbd0726396d87ef056d1e");
    weather=JSON.parse(weather.getBody('utf8'));

    var now = new Date();
    var date = now.getDate();
    var message=[];
    var restext = "";
    console.log(text);
    switch (text) {
      case "jutro":
          date = now.getDate()+1;
          message = weatherDay(date,weather);
          var len= Math.round((message.length/2)*100)/100;
          restext = "jutro będzie "+weather_description[message[len].weather[0].description]+". Temperatura wynosi "+
          (Math.round((parseFloat(message[len].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[len].main.pressure+" hektopaskali, a wilgotność:  "+message[len].main.humidity+" procent. Prędkość wiatru: "+
          (Math.round((parseFloat(message[len].wind.speed)*3.6)*100)/100)+" kilometrów na godzinę";
          console.log("jutro");
          break;

      case "pojutrze":
          date = now.getDate()+2;
          message = weatherDay(date,weather);
          len= Math.round(message.length/2);
          restext = "pojutrze będzie "+weather_description[message[len].weather[0].description]+". Temperatura wynosi "+
          (Math.round((parseFloat(message[len].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[len].main.pressure+" hektopaskali, a wilgotność:  "+message[len].main.humidity+" procent. Prędkość wiatru: "+
          message[len].wind.speed+" metrów na sekundę";
          console.log("pojutrze");
          break;

      case "w poniedziałek":
          date = date+(8-now.getDay());
          message = weatherDay(date,weather);
          restext = "w poniedziałek będzie "+weather_description[message[1].weather[0].description]+". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("poniedziałek");
          break;

      case "we wtorek":
          if(now.getDay()<2){
             date = date+1;
          }else{
            date = date+(9-now.getDay());
          }
          message = weatherDay(date,weather);
          restext = "we wtorek będzie "+weather_description[message[1].weather[0].description] +". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("wtorek");
          break;

      case "w środę":
          if(now.getDay()<3){
            date=date+(3-now.getDay());
          }else {
            date = date+(10-now.getDay());
          }
          message = weatherDay(date,weather);
          restext = "w środę będzie "+weather_description[message[1].weather[0].description] +". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("środę");
          break;

      case "w czwartek":
          if(now.getDay()<4){
            date=date+(4-now.getDay());
          }else {
            date = date+(11-now.getDay());
          }
          message = weatherDay(date,weather);
          restext = "w czwartek będzie "+weather_description[message[1].weather[0].description]+". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("czwartek");
          break;

      case "w piątek":
          if(now.getDay()<5){
            date=date+(5-now.getDay());
          }else {
            date = date+(12-now.getDay());
          }
          message = weatherDay(date,weather);
          restext = "w piątek będzie "+weather_description[message[1].weather[0].description] +". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("piątek");
          break;

      case "w sobotę":
          if(now.getDay()<6){
            date=date+(6-now.getDay());
          }else {
            date = date+(13-now.getDay());
          }
          console.log(date);
          message = weatherDay(date,weather);
          console.log(message);
          restext = "w sobotę będzie "+weather_description[message[1].weather[0].description]+". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("sobotę");
          break;

      case "w niedzielę":
          if(now.getDay()<7){
            date=date+(7-now.getDay);
          }else {
            date = date+(14-now.getDay());
          }
          message = weatherDay(date,weather);
          restext = "w niedzielę będzie "+weather_description[message[1].weather[0].description]+". Temperatura wynosi "+
          (Math.round((parseFloat(message[1].main.temp)-273.15) * 100) / 100)+ "stopni celsjusza. Ciśnienie wynosi "+
          message[1].main.pressure+" hektopaskali, a wilgotność:  "+message[1].main.humidity+" procent. Prędkość wiatru: "+
          message[1].wind.speed+" metrów na sekundę";
          console.log("niedzielę");
          break;

      case "w tym tygodniu":
          message = weather.list;
          /*zrobić tekst dla tygodnia*/
          break;
    }
    return [["pogoda",message], restext];
  }
}

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
    }else if (question.search(/^(jaka (jest|będzie)) ((.* pogoda)|pogoda)$/i) != -1) {
      resp=exports.weather(question);
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
