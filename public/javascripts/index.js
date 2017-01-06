var rect = 0;
var interval;

function draw_chart (date,variable){
  var ctx = document.getElementById("chart").getContext("2d");
  ctx.canvas.height = 100;
  var wykres = new Chart(ctx,{
    type: 'bar',
    data:{
      labels: date,
      datasets: [{
        label: "Temperatura",
        type:'line',
        data:variable[0],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        pointBorderColor: "rgba(2, 141, 196, 1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        yAxisID: "y-axis-0"
      },
      {
        label:'Temp max',
        data:variable[1],
        type:'line',
        backgroundColor: "rgba(40,132,132,0.4)",
        borderColor: "rgba(40,132,132,1)",
        pointBorderColor: "rgba(2, 131, 136, 1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        yAxisID: "y-axis-0"
      },
      {
        label:'Temp min',
        type:'line',
        data:variable[2],
        backgroundColor: "rgba(40,132,132,0.4)",
        borderColor: "rgba(40,132,132,1)",
        pointBorderColor: "rgba(2, 131, 136, 1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        yAxisID: "y-axis-0"
      },
      {
        label:'Wilgotność',
        type:'bar',
        data:variable[3],
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        backgroundColor:'rgba(255, 255, 255, 0.2)',
        yAxisID: "y-axis-1"
      },
      {
        label:'Prędkość wiatru',
        type:'bar',
        data:variable[4],
        borderColor: 'rgba(255, 164, 30, 1)',
        borderWidth: 1,
        backgroundColor:'rgba(255, 164, 30, 0.5)',
        yAxisID: "y-axis-2"
      },
    ]
    },
    options: {
      responsive: true,
      scales: {
        yAxes: [{
           id: 'y-axis-0',
           type: 'linear',
           position: 'left',
           ticks: {
                    // Create scientific notation labels
                    callback: function(value, index, values) {
                        return Math.round(value*100)/100+" °C";
                    }
                }
         }, {
           id: 'y-axis-1',
           type: 'linear',
           position: 'right',
           ticks: {
                    // Create scientific notation labels
                    callback: function(value, index, values) {
                        return Math.round(value*100)/100+" %";
                    }
                }
         },
         {
           id: 'y-axis-2',
           type: 'linear',
           position: 'right',
           ticks: {
                    // Create scientific notation labels
                    callback: function(value, index, values) {
                        return Math.round(value*100)/100+" km/h";
                    }
                }
         }]
       },
      tooltips: {
        mode: 'label',
        callbacks: {
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        },
        bodyFontSize: 15
      }
    }
  });
}

$(function(){
  $('#text_message').jScrollPane({showArrows:true,autoReinitialise: true});
  $('#terminal').jScrollPane({showArrows:true,autoReinitialise: true});
  $('#text_rss').jScrollPane({showArrows:true,autoReinitialise: true});
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
          var date = [];
          /*temp. temp min, temp max, wilgotność, prędkość wiatru*/
          var variable=[[],[],[],[],[]];
          console.log(res.answer[1]);
          var r =/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;
          for(var i=0; i<res.answer[1].length; i++){
            date.push(r.exec(res.answer[1][i].dt_txt)[0]);
            variable[0].push(Math.round((parseFloat(res.answer[1][i].main.temp)-273.15) * 100) / 100);
            variable[1].push(Math.round((parseFloat(res.answer[1][i].main.temp_max)-273.15) * 100) / 100);
            variable[2].push(Math.round((parseFloat(res.answer[1][i].main.temp_min)-273.15) * 100) / 100);
            variable[3].push(res.answer[1][i].main.humidity);
            variable[4].push(Math.round((parseFloat(res.answer[1][i].wind.speed)*3.6)*100)/100);
          }
          $('body > div.frame.transparent').toggleClass( "transparent" );
          draw_chart(date,variable);
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
