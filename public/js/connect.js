var socket = io.connect();

$('#TheInput').focus();

if(localStorage.getItem("Name") === null || localStorage.getItem("Name") === "null")
{
    $('#TheName').val(Math.floor((Math.random() * 10000000000) + 1));
} else {
    $('#TheName').val(localStorage.getItem("Name"));  
}
var checkTest = function(){return true;};

// loads all previous messages
var loadMessages = function(url){
  var xhrstatus;
  
  $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(result, status, xhr) {
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
            messages += '<li><span class="notification">[Showing last 100 messages]</li>';
            result.map(function(obj) {
                messages += '<li><span class="datetime">['+ obj.date + ']</span> ' + obj.name + ': ' + obj.message + '</li>';
            });
            
            $('.messages').html(messages);  
            xhrstatus = xhr.status;
        } 
     });
  return xhrstatus;
};
console.log(loadMessages("/message/all"));

// Setup message send function
var sendMessage = function(url, data){
  var xhrstatus;
  xhrstatus = $.ajax({
    url:url,
    type: 'post',
    data: data,
    dataType: 'json',
    async: false,
    success: function(result, status, xhr){
      console.log(result);
    }
  });
  return xhrstatus.status;
};

//Hit enter to submit form bind...
$('#TheInput').bind("enterKey",function(e){
    console.log("Submitting message!");
    var message = $('#TheInput').val();
    var name = $('#TheName').val();

    // Set session variable to remember typed name...
    localStorage.setItem("Name", name);
    console.log(sendMessage("/message/send", {message: message, name: name}));
  
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
});

// sends a message to the server
$('#TheButton').click(function() {
  console.log("Submitting message!");
  var message = $('#TheInput').val();
  var name = $('#TheName').val();
  
  // Set session variable to remember typed name...
  localStorage.setItem("Name", name);
  sendMessage("/message/send", {message: message, name: name});
});

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
  });
  userlist += "</ul>";
  $('#TheOnlineUsers').html(userlist);
});


// Recieves new messages
socket.on('new_message', function(data) {
console.log(data);
$('.messages').prepend("<li><span class='datetime'>[" + data.new_val.date + "]</span> " + data.new_val.name + ": " + data.new_val.message + "</li>");
});