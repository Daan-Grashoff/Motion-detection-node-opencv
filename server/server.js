const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8000);
app.use(express.static('client'));

io.on('connection', require('./socket'));
