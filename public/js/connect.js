/**
 * @author  Shannon Duncan
 * @version 1
 * @since 2015-12-20
 */
 
/**
 * Setup jQuery
 * @type  {jQuery} jQuery Javascript Library
 */
var $ = $;

/**
 * Setup SocketIO
 * @type  {socket}  SocketIO
 */
var socket = io.connect();



/**
 * Simple function to test if Jasmine tests are working
 * @returns  {boolean}  true  Always true
 */
var checkTest = function(){return true;};

/**
 * Function to check if username is stored in local storage
 * @returns  null
 */
var checkLocalStorage = function(){
  if(localStorage.getItem("Name") === null || localStorage.getItem("Name") === "null")
  {
      $('#TheName').val(Math.floor((Math.random() * 10000000000) + 1));
  } else {
      $('#TheName').val(localStorage.getItem("Name"));  
  }
}

/**
 * Function to load all messages from a certain url route
 * @param {url} url Always "/message/all" (The url to get messages)
 * @returns {number} status The Status of the Ajax Query
 */
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


/**
 * Function to send data to server
 * @param {url} url Always "/message/send" (The url to send a message too)
 * @param {json} data The message and username to send to the server
 * @returns {number} status The Status of the Ajax Query
 */
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

/**
 * Binds enter key and submit form to send message to the server
 */
var inputBinding = function(){
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
  
  // sends a message to the server
  $('#TheButton').click(function() {
    console.log("Submitting message!");
    var message = $('#TheInput').val();
    var name = $('#TheName').val();
    
    // Set session variable to remember typed name...
    localStorage.setItem("Name", name);
    sendMessage("/message/send", {message: message, name: name});
  });
}

/**
 * Binds set username button and socket event for sending initial name.
 * @param {socket} socket The SocketIO Reference
 */
var usernameBinding = function(socket){
  // Clear username cache
  $('#TheClear').click(function() {
    localStorage.setItem("Name", $('#TheName').val());
    socket.emit('namechange', { name: localStorage.getItem("Name")});
  });
  
  // Send username
  socket.on('connect', function(){
    socket.emit('newuser', { name: localStorage.getItem("Name")});  
  }); 
}

/**
 * Binds the socket recieve event of online users to display current online users
 * @param {socket} socket The SocketIO Reference
 */
var bindOnlineUsers = function(socket){
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
}

/**
 * Binds the socket recieve event of new message to display new messages
 * @param {socket} socket The SocketIO Reference
 */
var bindNewMessages = function(socket){
  // Recieves new messages
  socket.on('new_message', function(data) {
  console.log(data);
  $('.messages').prepend("<li><span class='datetime'>[" + data.new_val.date + "]</span> " + data.new_val.name + ": " + data.new_val.message + "</li>");
  });
}

/**
 * Main Client Side Program - Client Side Realtime Chat
 * @type  {main}
 */
var main = function(){
  $('#TheInput').focus();
  
  //Check to see if a user is stored already
  checkLocalStorage();
  
  
  // Load Messages
  loadMessages("/message/all");
  
  // Bind actions to the sending of a message and input area
  inputBinding();
  
  // Bind actions for the name change area
  usernameBinding(socket);
  
  // Bind Socket for Users
  bindOnlineUsers(socket);
  
  // Bind Socket for Messages
  bindNewMessages(socket);
}
main();

