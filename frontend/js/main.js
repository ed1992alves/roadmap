// DOM element where the Timeline will be attached
  
data = 0;
var priorities = ['Medium', 'High', 'Critical'];
var prioritiesFilter = [];
var users = [];
var usersByEvent =[];

getUsers();

getEvents().then(function(response) {
  startTimeline(response.data);
}, function(error) {
  console.error("Failed!", error);
});

function cleanLayout(){
  $(".specification .formfield").empty();
  $(".specification button").removeAttr('disabled');
  $('.specification .dropdownOptions').css("display", "none");
  $('.specification .dropdown').removeClass("ative");
  $('.dropdownOptions.users').unbind("click");
  $('.specification .buttons button').remove();
  $('.modal').hide();
}

function changeContentInterface(e){
  items._data[e.id].start = e.start.getFullYear()+'-'+ formatNumber(e.start.getMonth()+1) +'-' + formatNumber(e.start.getDate()) + ' 00:00:00';
  e.end.setTime(e.end.getTime() - (60*60*1000));
  items._data[e.id].end = e.end.getFullYear()+'-'+ formatNumber(e.end.getMonth()+1) +'-' + formatNumber(e.end.getDate()) + ' 23:59:59';

    obj = {
      startDate: items._data[e.id].start,
      endDate: items._data[e.id].end
    }

  changeDates(obj, e.id);
}

function showModal(indice, startDate, endDate){

  modal = true;

  $('.modal').show(); 

  $('.specification').click(function (event) {
    event.stopPropagation();
  });
  
  showInfo(indice, startDate, endDate);

  if(indice != 0){
    element1 = $("<button class='submit edit' onclick=submitContent('edit'," + indice + ") >Submit changes</button>");
    element2 = $("<button class='delete'>Delete event</button>");
  }
  
  else{
    element1 = $("<button class='submit insert disabled' onclick=submitContent('insert')>Submit</button>");
    element2 = $("<button class='delete disabled'>Delete event</button>");
  }

  
  $(".buttons").append(element1);
  $(".buttons").append(element2);


  $('.title input').on("change paste keyup", function(){
    $('.submit').addClass('disabled');
    if($('.title input').val() != "" )
    {
      nrDays($('.startDate input').val() + ' 00:00:00' , $('.endDate input').val() + ' 23:59:59');
    }
  });

  $('.delete:not(.disabled)').click(function () {
    if(! $('.insert').hasClass('disabled')){
      cleanLayout();
      deleteEvent(indice);
    }
  });

  $('.title input').focus().setCursorPosition(0);

  
  
}

function submitContent(method,index) {
  if(! $('.'+method).hasClass('disabled')){
    var usersByEvent = $('.dropdownOptions.users .active')[0].outerText;
    for(i=1; i< $('.dropdownOptions.users .active').length; i++)
    {
      usersByEvent = usersByEvent + '|' + $('.dropdownOptions.users .active')[i].outerText;
    }
    var obj = { 
      content: $('.title input').val(),
      startDate: $('.startDate input').val() + ' 00:00:00', 
      endDate : $('.endDate input').val() + ' 23:59:59', 
      detail : $('.content textarea').val(),
      className : $('.specification .dropdown.priorityFilter').html(),
      users: usersByEvent,
    };

    if(method== "insert")
    sendNewEvent(obj);
    if(method== "edit")
    changeContent(obj, index);

    cleanLayout();
  }
  
};

//fill the dropdown with the users from a specific event
function fillUsersByEvent(data){

  usersByEvent = [];

  for(aux=0; aux < data.length; aux++)
  {
      usersByEvent[aux] = data[aux].name;
  }

  $('.specification .dropdownOptions.users').empty();
  
  for(aux=0; aux < users.length; aux++){
    if(usersByEvent.indexOf(users[aux].name) != -1)
      $('.specification .dropdownOptions.users').append("<div class='option option"+aux+" active'>"+ users[aux].name +"</div>");
    else
      $('.specification .dropdownOptions.users').append("<div class='option option"+aux+"'>"+ users[aux].name +"</div>"); 
  } 
  
  $('.dropdownOptions.users').click(function (event) {
    $('.users .'+event.toElement.getAttribute('class').split(" ")[1]).toggleClass('active');
    event.stopPropagation();
  });

}

function showInfo(i,startDate, endDate){

  if(i!=0)
  {
    var obj = getItem(i);

    getInfoByEvent(i).then(function(response) {
      fillUsersByEvent(response['data']);
    }, function(error) {
      console.error("Failed!", error);
    })
  }
  
  else 
  {
    var obj = newItem(startDate, endDate);
    fillUsersByEvent(getUserName());
  }

  titleHTML = $("<input>", {type: "text", placeholder: "Insert Event Title"});
  if(obj.content != null){
    titleHTML = $("<input>", {type: "text", value: obj.content, placeholder: "Insert Event Title"});
  }
  appendInModal('title', titleHTML);
  
  startDateHTML = $("<input>", {type: "date", value: obj.start.split(" ")[0]});
  appendInModal('startDate', startDateHTML);

  width = $(".secondColumn").width() -45 + 'px';
  height = $(".content").height() -20 + 'px';
  descriptionHTML = $('<textarea name="Text1" style=" width:'+ width+'; height:'+ height+'"></textarea>');

  if( obj.detail != undefined)
    descriptionHTML = $('<textarea name="Text1" style=" width:'+ width+'; height:'+ height+'">'+obj.detail+'</textarea>');

  appendInModal('content', descriptionHTML);

  if(obj.end != null){
    endDateHTML = $("<input>", {type: "date", min:obj.start.split(" ")[0], value: obj.end.split(" ")[0]});
  }
  appendInModal('endDate', endDateHTML);

  nrDays(obj.start, obj.end);
  
  if(obj.className != null){
    $(".specification").removeClass('Medium High Critical');
    $(".specification ").addClass(obj.className);
    $(".specification .priorityFilter").empty();
    $(".specification .priorityFilter").append(obj.className);
  }
}

function appendInModal(title, value){
  $(".specification ."+title+"").append(value);
}

function getOption(option){
  for(position=0; position < priorities.length; position ++)
  {
    if(option == priorities[position])
    return position +1;
  }
}

//layout changes in modal dropdown related with priority
function changePriorityOnEvent(i){
  $('.priorityFilter').html(priorities[i]);
  $(".specification").removeClass('Medium High Critical');
  $(".specification ").addClass(priorities[i]);
  $('.priorityFilter').toggleClass("ative");
  $('.specification .priority').css("display", "none");
}

//format number (normally days) to have at least two digits (convert 1-9 in 01-09)
function formatNumber(number) {
   return (number < 10 ? '0' : '') + number;
}

//Click in navigation Today button
$(".today").click(function(){
  if($(this)[0].getAttribute('class').split(" ")[1] == null)
  {
    moveTimeline();
    enableToday(false);
  }
});

function dropdownClick(zone, option){

  $('.'+zone+' .'+option+'Filter').toggleClass('ative');
  if( option == "zoom" || option == "users")
    $('.'+zone+' .priorityFilter').removeClass('ative');

  else
  {
    $('.'+zone+' .zoomFilter').removeClass('ative');
    $('.'+zone+' .usersFilter').removeClass('ative');
  }
  
  event.stopPropagation();
  
  $('.dropdownOptions').css("display", "none");

  if($('.'+zone+' .'+option+'Filter.ative').length == 1)
  {
    $('.'+zone+' .'+option).css("display", "block");
  }

};

//Select an option in Zoom 
$('.navigation .zoom').click(function (event) {
  $('body').removeClass("monthView");
  option = event.toElement.getAttribute('class').split(" ")[1];
  
  if(option == "option1")
  {
    zoomMax = zoomMin = 1000 * 60 * 60 * 24 * 7 * 1; // 1 week
    timeAxis= {scale: 'day', step: 1}          //each column is a day
  }

  if(option == "option2"){
    zoomMax = zoomMin =  1000 * 60 * 60 * 24 * 31 * 1;     // 1 month
    timeAxis= {scale: 'day', step: 1}          //each column is a day
  }

  if(option == "option3"){
    zoomMax = zoomMin = 1000 * 60 * 60 * 24 * 31 * 4;     // 4 months (1 quarter)
    timeAxis= {scale: 'month', step: 1}          //each column is a month
    window.setTimeout(function() {
      $('body').addClass("monthView");
  }, 100);
  }

  if(option == "option4"){
    zoomMax = zoomMin= 1000 * 60 * 60 * 24 * 31* 12 * 1;     // 12 months (1 quarter)
    timeAxis= {scale: 'month', step: 1}              //each column is a month
    window.setTimeout(function() {
      $('body').addClass("monthView");
  }, 100);
  }

  $('.zoomFilter').html($('.navigation .'+ option).html());
  $('.zoomFilter').toggleClass("ative");
  $('.navigation .zoom').css("display", "none");
  $('.navigation .zoom .option').removeClass('selected');
  $('.navigation .zoom .'+ option).addClass('selected');
  dropdownAtive = false;

  changeOptions(zoomMax, zoomMin, timeAxis);
});

$('.navigation .priority .option').click(function(event){

  event.stopPropagation();

  option = event.toElement.getAttribute('class').split(" ")[1];

  $(this).toggleClass('selected');
  firstPriority = null;
  secondPriority = null;

  //seleccionado Select All, todas as opções ou nenhuma das opções
  if( option =="option1" || $('.navigation .priority .option.selected').length >= 3 || $('.navigation .priority .option.selected').length == 0){
    $('.navigation .priority .option').removeClass('selected');
    $('.navigation .priority .option1').addClass('selected');
  }

  if($('.navigation .priority .option:not(.all).selected').length == 1)
  {
    $('.navigation .priority .option1').removeClass('selected');
    firstPriority = $('.navigation .priority .option:not(.all).selected').get(0).innerHTML;
  }

  //seleccionada duas opções (onde nenhuma delas é o Select All)
  if($('.navigation .priority .option:not(.all).selected').length == 2)
  {
    $('.navigation .priority .option1').removeClass('selected');
    firstPriority = $('.navigation .priority .option:not(.all).selected').get(0).innerHTML;
    secondPriority = $('.navigation .priority .option:not(.all).selected').get(1).innerHTML;
  }  
  
  getEvents(firstPriority, secondPriority).then(function(response) {
    changePriority(response.data);
  }, function(error) {
    console.error("Failed!", error);
  });
  
});

//startDate input has being changed and the minimun value for the endDate input need to be changed
$('.startDate').change(function(){
  element = $("<input>", {type: "date", min: $('.startDate input').val() , value: $('.endDate input').val()});
  $(".specification .endDate").empty();
  $(".specification .endDate").append(element);
  nrDays($('.startDate input').val() + ' 00:00:00' , $('.endDate input').val()+ ' 23:59:59');
});

$('.endDate').change(function(){
  nrDays($('.startDate input').val() + ' 00:00:00' , $('.endDate input').val()+ ' 23:59:59');
});


//validate if date representes the atual day
function isToday(date){

  var now = timeline.getCurrentTime();
  if(date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear()){
    enableToday(false);
  }
  else
    enableToday(true)

}

function enableToday(enable){
  $('.today').addClass('disabled');

  if(enable)
    {$('.today').removeClass('disabled');}
}

function nrDays(startDate, endDate){
  startDate= new Date(startDate);
  endDate= new Date(endDate);
  ndays = Math.round((endDate-startDate)/(1000*60*60*24));
  $('.ndays').html(ndays + ' day');
  if(ndays !=1)
  $('.ndays').html(ndays + ' days');

  $('.submit').addClass('disabled');
  if(ndays > 0 && $('.title input').val() != "" )
  {
      $('.submit').removeClass('disabled');
  }
}

$.fn.setCursorPosition = function (pos) {
  this.each(function (index, elem) {
      if (elem.setSelectionRange) {
          elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
          var range = elem.createTextRange();
          range.collapse(true);
          range.moveEnd('character', pos);
          range.moveStart('character', pos);
          range.select();
      }
  });
  return this;
};

$('.specification').click(function(event){
  event.stopPropagation();
})

$('body').click(function(){
  $('.navigation .dropdownOptions').css("display", "none");
  $('.dropdown').removeClass('ative');
  if($('.modal').css('display') == 'block' && modal)
  {
    //cleanLayout();
  }
  
});