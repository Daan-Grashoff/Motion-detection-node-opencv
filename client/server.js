const express = require('express');

const app = express();
const server = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(server);


app.use(express.static(path.join(__dirname + '/build')));

server.listen(8080);
app.use(express.static('client'));

let cameras = [];
io.on('connection', (socket) => {
  socket.broadcast.emit('resetcams')
  socket.on('cameras', data => {
    cameras.push(data.cameras);
    socket.broadcast.emit('cameras', cameras);
  })
  socket.on('cameraBuff', data => {
    data.buffers.forEach((data) => {
      socket.broadcast.emit(`camera${data.id}`, data.buffer);
    }, this);
    // socket.broadcast.emit('sensorData', data);
  })
  socket.on('sensorData', data => {
    socket.broadcast.emit('sensorData', data);
  })
  socket.on('getcameras', data => {
    socket.emit('cameras', cameras);
  })




  console.log(cameras);

})