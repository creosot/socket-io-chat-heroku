/**
 * Created by igor on 22.04.14.
 */
//var myCRC16 = require('./libs/crc.js');
var net = require('net');

var ruppells_sockets_local_port = process.env.RUPPELLS_SOCKETS_LOCAL_PORT || 1337;

var server = net.createServer(function(socket) { //'connection' listener
    console.log("Connected Client: " + socket.remoteAddress + ":" + socket.remotePort);
    socket.on('end', function() {
        console.log('server disconnected');
    });
    socket.write('hello\r\n');
    socket.on('data', function(data){
        var cleanData = cleanInput(data);
        if(cleanData === "quit") {
            socket.end('Goodbye!\n');
        }
    })
});
server.listen(ruppells_sockets_local_port, function() { //'listening' listener
    console.log('ruppells_sockets_local_port ' + port);
});

function cleanInput(data) {
    return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}
