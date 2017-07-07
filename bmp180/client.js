var fs = require('fs');
var io = require('socket.io-client');
var server = io.connect('http://⁠⁠⁠⁠⁠145.24.211.150:8080');

function update(){
    fs.readFile('data.txt', 'utf8', function(err, contents) {
        console.log(contents);
        server.emit('sensorData', contents);
    });
}

server.on('connect', function(){
    console.log("connected")
});

setInterval(update, 1000);