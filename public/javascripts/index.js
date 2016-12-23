var rect = 0;
var interval;


$(function(){
  $('#text_message').jScrollPane({showArrows:true,autoReinitialise: true});
  $('#terminal').jScrollPane({showArrows:true,autoReinitialise: true});
  $('#text_rss').jScrollPane({showArrows:true,autoReinitialise: true});

  $('div.sound.buttons').on("mousewheel",function(e){
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

var rec_button=false;
$(document).on("click",'div.rec.buttons',function(e){
  if(rec_button){
    $('#rc3').css({'fill':'white','fill-opacity':'.573','stroke':'white'});
    rec_button=false;
    $.ajax({
      type:"POST",
      url:'/',
      data:{'rec':'off'},
      dataType:'JSON'
    }).done(function(res){
      $('#text_message > div > div.jspPane').append('<p>'+res.msg+'</p>');
      console.log("off");
      console.log(res);
      $.ajax({
        type:"POST",
        url:'/',
        data:{'rec':'response'},
        dataType:'JSON'
      }).done(function(res){
        console.log("response");
        if(res.answer[0]=="google"||res.answer[0]=="wikipedia"||res.answer[0]=="pogoda_teraz"){
          for (let i = 0; i < res.answer[1].length; i++) {
            $('#text_message > div > div.jspPane').append('<p>'+res.answer[1][i]+'</p>');
          }
        }else if (res.answer[0]=="pogoda") {
        //  wykrespogody(res.answer[1]);
          console.log("wykres pogody");
        }
      }).fail(function(res){
        alert("wystąpił błąd");
        console.log(res.responseText);
      });
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
