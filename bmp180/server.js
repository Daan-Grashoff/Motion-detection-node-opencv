var io = require('socket.io').listen("8080");
io.sockets.on('connection', function (socket) {
    socket.on('hello', function(data){
        console.log('new client connected');
    });
    socket.on('sensorData', function(data){
        console.log(data)        
    });
});