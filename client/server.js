const express = require('express');

const app = express();
const server = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname + '/build')));

server.listen(8080);
app.use(express.static('client'));

io.on('connection', (socket) => {
  socket.on('sensorData', data => {
    socket.broadcast.emit('sensorData', data);
  })
  socket.on('camera0', data => {
    socket.broadcast.emit('camera0', data);
  })
  socket.on('camera1', data => {
    socket.broadcast.emit('camera1', data);
  })
})