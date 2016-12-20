var rect = 0;
var interval;
$(function(){
  $('#text_message').jScrollPane({showArrows:true,autoReinitialise: true});
  $('#terminal').jScrollPane({showArrows:true,autoReinitialise: true});
  $('#text_rss').jScrollPane({showArrows:true,autoReinitialise: true});
});

$(document).on( "mousedown",'div.sound.buttons',function(e){
  if(e.button == 0){
    interval=setInterval(function () {
      var button = $('div.sound.buttons>svg rect');
      $(button[rect]).css({ "fill-opacity": "1" });
      if(rect<button.length)
          rect++;
    }, 100);
  }else if(e.button == 2){
    interval=setInterval(function(){
      if(rect>0)
          rect--;
      var button = $('div.sound.buttons>svg rect');
      $(button[rect]).css({ "fill-opacity": "0.44" });
    },100);
  }
});
$(document).on( "mouseup",'div.sound.buttons',function(e){
  clearInterval(interval);
});
$(document).on( "mouseout",'div.sound.buttons',function(e){
  clearInterval(interval);
});
$(document).on( "mousewheel",function(e){
  if(e.originalEvent.wheelDelta> 0){
    var button = $('div.sound.buttons>svg rect');
    $(button[rect]).css({ "fill-opacity": "1" });
    if(rect<button.length)
        rect++;
  }else{
    if(rect>0)
        rect--;
    var button = $('div.sound.buttons>svg rect');
    $(button[rect]).css({ "fill-opacity": "0.44" });
  }
});

var rec_button=false;
$(document).on("click",'div.rec.buttons',function(e){
  if(rec_button){
    $.ajax({
      type:"POST",
      url:'/',
      data:{'rec':'off'},
      dataType:'JSON'
    }).done(function(res){
      $('#rc3').css({'fill':'white','fill-opacity':'.573','stroke':'white'});
      rec_button=false;
      $('#text_message > div > div.jspPane').append('<p>'+res.msg+'</p>');
      console.log("off");
      console.log(res);
    }).fail(function(res){
      alert("wystąpił błąd");
      console.log(res.responseText);
    });
  }else{
    $.ajax({
      type:"POST",
      url:'/',
      data:{'rec':'on'},
      dataType:'JSON'
    }).done(function(res){
      $('#rc3').css({'fill':'red', 'fill-opacity':"1",'stroke':'red'});
      rec_button=true;
      console.log("on");
    }).fail(function(res){
      alert("wystąpił błąd");
      console.log(res.responseText);
    });/*.always()*/
  }
});
