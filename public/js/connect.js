var socket = io.connect();

$('#TheInput').focus();

if(localStorage.getItem("Name") === null || localStorage.getItem("Name") === "null")
{
    $('#TheName').val(Math.floor((Math.random() * 10000000000) + 1));
} else {
    $('#TheName').val(localStorage.getItem("Name"));  
}


// loads all previous messages
$.get('/message/all', function(result) {
    var messages = "";
    
    messages += '<li>';
    messages += '<br>';
    messages += '<div style="height: 2px; color:red; background-color: red; text-align: center">';
    messages += '<span style="background-color: white; position: relative; top: -0.6em;">';
    messages += '&nbsp;Messages Before You Logged On&nbsp;';
    messages += '</span>';
    messages += '</div>';
    messages += '<br>';
    messages += '</li>';
    messages += '<li></li>';
    messages += '<li><span class="notification">[Showing last 100 messages]</li>'
    result.map(function(obj) {
        messages += '<li><span class="datetime">['+ obj.date + ']</span> ' + obj.name + ': ' + obj.message + '</li>';
    });
    
    $('.messages').html(messages);
});

//Hit enter to submit form bind...
$('#TheInput').bind("enterKey",function(e){
    console.log("Submitting message!");
    var message = $('#TheInput').val();
    var name = $('#TheName').val();

    // Set session variable to remember typed name...
    localStorage.setItem("Name", name);
    $.post('/message/send', {message: message, name: name}, function(result) {
    console.log(result);
    });
  
    $('#TheInput').val("");
});

// Hit enter to submit form action...
$('#TheInput').keyup(function(e){
  if(e.keyCode == 13)
  {
      $(this).trigger("enterKey");
  }
});

// Clear username cache
$('#TheClear').click(function() {
  localStorage.setItem("Name", $('#TheName').val());
  socket.emit('namechange', { name: localStorage.getItem("Name")});
})

// sends a message to the server
$('#TheButton').click(function() {

console.log("Submitting message!");
var message = $('#TheInput').val();
var name = $('#TheName').val();

// Set session variable to remember typed name...
localStorage.setItem("Name", name);
  $.post('/message/send', {message: message, name: name}, function(result) {
    console.log(result);
  });
})

// Send username
socket.on('connect', function(){
  socket.emit('newuser', { name: localStorage.getItem("Name")});  
});


// Recieve online Users
socket.on('online', function(data) {
  console.log(JSON.stringify(data));
  var userlist = "<ul>";
  $.each(data, function(key, value){
    console.log(value);
    userlist += "<li>" + value + "</li>";
  })
  userlist += "</ul>";
  $('#TheOnlineUsers').html(userlist)
});

// Recieves new messages
socket.on('new_message', function(data) {
console.log(data);
$('.messages').prepend("<li><span class='datetime'>[" + data.new_val.date + "]</span> " + data.new_val.name + ": " + data.new_val.message + "</li>");
});