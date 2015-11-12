console.log("Setting up dependencies...");
var r = require('rethinkdb');
var express = require('express');
var async = require('async');
var io = require('socket.io');

console.log("Done!");

console.log("Connect to RethinkDB!!");
var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    console.log("Done!!");
});

console.log("Setup databases if they don't already exist...");
async.waterfall([
  function(finished) {
    r.dbList().contains('messages_db')
      .run()
      .then(function(result) {
        finished(null, result)
      })
      .error(function(err) {
        finished(err);
      })
  },
  function(dbExists, finished) {
    if (dbExists == false) {
      r.dbCreate('messages_db')
        .run()
        .then(function() {
          finished(null);
        })
        .error(function(err) {
          finished(err);
        });
    } else {
      finished(null);
    }
  },
  function(finished) {
    r.db('messages_db').tableList().contains('messages')
      .run()
      .then(function(result) {
        finished(null,result);
      })
      .error(function(err) {
        finished(err);
      });
  },
  function(tableExists, finished) {
    if (tableExists == false) {
      r.db('messages_db').tableCreate('messages')
        .run()
        .then(function(result) {
          finished(null, false);
        })
        .error(function(err) {
          finished(err);
        })
    } else {
      finished(null, true);
    }
  },
  function(tableIndexed, finished) {
    if (tableIndexed == false) {
      r.db('messages_db').table('messages').indexCreate('date')
        .run()
        .then(function(result) {
          finished(null);
        })
        .error(function(err) {
          finished(err);
        })
    } else {
      finished(null);
    }
  }
], function(err) {
  if (err) throw err;
});
console.log("Done...");


console.log("Setup Send Message REST API..");
express.post('/send', function(req,res,next) {
    var message = req.body.message;
    r.db('messages_db').table('messages')
      .insert({
        message: message,
        date: new Date()
      })
      .run()
      .then(function(result) {
        res.send('Message sent!');
      })
      .error(function(err) {
        res.status(500).send('Internal Server Error');
      })
  });
  console.log("Done..");
  
  
  console.log("Setup get all messages REST API");
  express.get('/all', function(req,res,next) {
    r.db('messages_db').table('messages')
      .orderBy({index: r.asc('date')})
      .run()
      .then(function(result) {
        res.send(result);
      })
      .error(function(err) {
        res.status(500).send('Internal Server Error');
      })
  });
  console.log("Done");
  
  
  console.log("Setup socket.io emitter!!!!");
  r.db('rethinkdb_tutorial').table('messages')
  .changes()
  .run()
  .then(function(cursor) {
    cursor.each(function(err, result) {
      console.log(result);
      io.emit('new_message', result);
    });
  });
  console.log("Done!!!!");