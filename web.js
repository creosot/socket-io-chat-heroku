
// chat functions
var peeps = {};

function broadcast(message, sender) {
    for ( var sendTo in peeps ) {
        if ( sendTo != sender ) {
            console.log("checking " + sendTo + " in " + peeps);
            peeps[sendTo].send(message, sender);
        }
    }
}

function joined(name) {
    broadcast("I've joined the chat!", name)
}

function left(name) {
    broadcast(name + " left the chat.", name);
    delete peeps[name];
}

// HTTP stuff
var http_port = process.env.PORT || 5000;

var express = require('express'), app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , jade = require('jade');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
        app.use(express.static(__dirname + '/public'));
});
app.get('/', function(req, res){
  res.render('home.jade');
});
server.listen(http_port);
console.log("HTTP listening on " + http_port);
io.sockets.on('connection', function (socket) {
    var name = "HTTP -> " + socket.handshake.address.address + ":" + socket.handshake.address.port;
    peeps[name] = {
        'send' : function (message, sender) { socket.emit('message', { 'message' : message, 'name' : sender }); }
    };
    socket.emit('message', { 'message' : "Welcome " + name, 'name' : "Server"});
    joined(name);
    socket.on('message', function (message) {
        broadcast(message, name);
    });
    socket.on('disconnect', function () {
        left(name);
    });
});

// TCP socket stuff
var ruppells_sockets_port = process.env.RUPPELLS_SOCKETS_LOCAL_PORT || 1337;
net = require('net');
net.createServer(function (socket) {
    var name = "TCP -> " + socket.remoteAddress + ":" + socket.remotePort
    peeps[name] = {
        'send' : function(message, sender) { socket.write(sender + " said " + message + "\n") }
    };
    socket.write("Welcome " + name + "\n");
    joined(name);
    socket.on('data', function (data) {
        broadcast(data.toString().replace(/(\r\n|\n|\r)/gm,""), name);
    });
    socket.on('end', function () {
        left(name);
    });
}).listen(ruppells_sockets_port);
console.log("TCP listening on " + ruppells_sockets_port);
