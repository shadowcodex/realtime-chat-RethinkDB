/**
 * @author  Shannon Duncan
 * @version 1
 * @since 2015-12-20
 */
 
/**
 * Express Used for Routing
 * @type  {Express} Express Web Framework
 */
var express = require('express');
var app = express();
/**
 * HTTP Server used to serve express routes and static files
 * @type  {http}  http web server
 */
var server = require("http").createServer(app);
/**
 * Waterfall library used to run async tasks in sync order
 * @type  {async} async library
 */
var async = require('async');
/**
 * Socket.IO Library used to send realtime messages via websockets
 * @type  {socket}  SocketIO Library
 */
var io = require('socket.io')(server);
/**
 * RethinkDBDash used to setup and use RethinkDB in NodeJS Easily Without having to worry about setting up connections and such.
 * @type  {rethinkdbdash} Rethinkdb Dash Library
 */
var r = require('rethinkdbdash')();
/**
 * BodyParser used to parse data coming into a route
 * @type  {bodyparser} Body Parser Library
 */
var bodyParser = require('body-parser');

/**
 * An array and count of online users set up to relay back to clients
 * @type  {Array} Online User List
 */
var onlineUsers = {};
var online = 0;




/**
 * Main Server Side Program - Realtime Chat with RethinkDB
 */
 var main = function(){
   async.waterfall([
    function(finished) {
      
      // Check if the database for messages exists or not.
      r.dbList().contains('messages_db')
        .run()
        .then(function(result) {
          // return result to the next waterfall
          finished(null, result);
        })
        .error(function(err) {
          finished(err);
        });
    },
    function(dbExists, finished) {
      // if it doesn't exist create it. Otherwise move on.
      if (dbExists === false) {
        r.dbCreate('messages_db')
          .run()
          .then(function() {
            // return null and move to next waterfall
            finished(null);
          })
          .error(function(err) {
            finished(err);
          });
      } else {
        // return null and move to next waterfall
        finished(null);
      }
    },
    function(finished) {
      // Check if the database contains a table for messages.
      r.db('messages_db').tableList().contains('messages')
        .run()
        .then(function(result) {
          // return the result to the next waterfall
          finished(null,result);
        })
        .error(function(err) {
          finished(err);
        });
    },
    function(tableExists, finished) {
      // If the table doesn't exist, then create it. Otherwise mvoe on.
      if (tableExists === false) {
        r.db('messages_db').tableCreate('messages')
          .run()
          .then(function(result) {
            // Move on to next waterfall
            finished(null, false);
          })
          .error(function(err) {
            finished(err);
          });
      } else {
        // Move on to next waterfall
        finished(null, true);
      }
    },
    function(tableIndexed, finished) {
      // If the table didn't exist and we had to create it. Then create an index.
      // Otherwise move on.
      if (tableIndexed === false) {
        r.db('messages_db').table('messages').indexCreate('date')
          .run()
          .then(function(result) {
            finished(null);
          })
          .error(function(err) {
            console.log("Error indexing... : " + err);
            finished(err);
          });
      } else {
        finished(null);
      }
    }
  ], function(err) {
    if (err) throw err;
    
    // This is the finall waterfall. Start the applicaiton in here so as to make
    // Sure that the program is done running first.
    
    
    // Start Main Program
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    
    // Setup Express Routes
    setupRoutes(app, r);
    // Setup Socket Connection and Information
    createSock(io);
    // Setup socket emitter for when database changes happen
    createEmitter(io, r);
    // Setup express to serve the static files
    serveStaticFiles(server, app);
    
    process.on('uncaughtException', function(err) {
      console.log(err);
    });
    
    // End main Program
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    // ###########################################################################
    
  });// End Database Setup Checker...
 };



/**
 * Creates the socket information for Socket.IO
 * @param   {object}  io  The Socket.IO Reference
 */
var createSock = function(io){
  //Create socket.io event
  console.log("Setup socket.io connection.....");
  io.on('connection', function(socket) {
    console.log('New client connected ' + socket.id);
    
    socket.on('namechange', function(data){
      console.log(socket.id + " Changed his/her name");
      onlineUsers[socket.id] =  data.name;
      sendOnlineUsers(io, onlineUsers);
    });
    
    socket.on('newuser', function(data){
      console.log("new user recieved" + data.name);
      onlineUsers[socket.id] =  data.name;
      sendOnlineUsers(io, onlineUsers);
    });
    
    socket.on('disconnect', function() {
      console.log(socket.id + " client disconnected");
      delete onlineUsers[socket.id];
      sendOnlineUsers(io, onlineUsers);
    });
  });
  console.log("Done.....");
};

/**
 * Sets up the socket emitter for when new messages hit the database
 * @param   {object}  io  The Socket.IO Reference
 * @param {object} r The RethinkDB Reference
 */
var createEmitter = function(io, r){
  console.log("Setup socket.io emitter for messages!!!!");
  r.db('messages_db').table('messages')
  .changes()
  .run()
  .then(function(cursor) {
    cursor.each(function(err, result) {
      console.log(result);
      io.emit('new_message', result);
    });
  });
  console.log("Done!!!!");
};

/**
 * Makes sure we have the right port to serve the files from, and setups express static routing.
 * @param {object} server The Express-HTTP Reference
 * @param {object} app The Express Reference
 */
var serveStaticFiles = function(server, app){
  //Serve the static html page.
  var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 80;
  server.listen(port);
  
  app.use('/', express.static(__dirname + '/public'));
  app.use('/static', express.static(__dirname + '/bower_components'));
  
  console.log("listening on port: " + port);
};

/**
 * Function to send list of online users through socket
 * @param {object} io The Socket.IO Reference
 * @param {Array} onlineUsers Array of Online Users
 */
var sendOnlineUsers = function(io, onlineUsers){
  io.emit('online', onlineUsers);
};

/**
 * Function to set up all routes for the application. Sets up send and get messages
 * @param {object} app The Express Reference
 * @param {object} r The RethinkDB Reference
 */
var setupRoutes = function(app, r){
  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  
  // Set send rest API
  console.log("Setup Send Message REST API..");
  app.post('/message/send', function(req,res,next) {
    console.log("New message incoming!!");
    var message = req.body.message;
    var name = req.body.name;
    r.db('messages_db').table('messages')
      .insert({
        name: name,
        message: message,
        date: new Date()
      })
      .run()
      .then(function(result) {
        res.send('Message sent!');
      })
      .error(function(err) {
        res.status(500).send('Internal Server Error');
      });
  });
  console.log("Done..");
  
  
  // Set get messages API
  console.log("Setup get all messages REST API");
  app.get('/message/all', function(req,res,next) {
    r.db('messages_db').table('messages')
      .orderBy({index: r.desc('date')})
      .limit(100)
      .run()
      .then(function(result) {
        res.send(result);
      })
      .error(function(err) {
        res.status(500).send('Internal Server Error');
        console.log("Error getting all messages");
        console.log(err);
      });
  });
  console.log("Done");
};



/**
 * Call Main Function
 * @see main
 */
if (require.main === module) {
    main();
}