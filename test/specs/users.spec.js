/*global helpers, expect*/
describe("Test All User Sockets", function(){
    var h = helpers;

    var socketURL = 'http://localhost:8080';
    var client;
    var clientid;
    
    var options ={
      transports: ['websocket'],
      'force new connection': true
    };
    
    var chatUser = { name: h.randomInt(10154135)};
    var chatReturn = {};
    
    var testNewUser = function(tuser){
        client.emit('newuser', tuser);
    };
    
    var testNameChange = function (tuser){
        client.emit('namechange', tuser);
    }
    
    beforeEach(function(done){
        client = io.connect(socketURL, options);
        client.on('connect', function(data){
            done();
        });
    });
    
    afterEach(function(done){
        if(client.connected) {
            client.disconnect();
        }
        done();
    });
    
    
    
    it('Should broadcast new user to all users', function(done){
        client.on('online', function(data){
            var name;
            for (var key in data) {
                if(data.hasOwnProperty(key)){
                    if(data[key] == chatUser.name)
                    {
                        name = data[key];
                    }
                }
            }
            expect(chatUser.name).toBe(name);
            done();
        });
        testNewUser(chatUser);
    });
    
    it('Should broadcast name change to all users', function(done){
        client.on('online', function(data){
            var name;
            for (var key in data) {
                if(data.hasOwnProperty(key)){
                    if(data[key] == chatUser.name)
                    {
                        name = data[key];
                    }
                }
            }
            expect(chatUser.name).toBe(name);
            done();
        });
        chatUser.name = h.randomInt(10154135);
        testNameChange(chatUser);
    });
    
    
    
});