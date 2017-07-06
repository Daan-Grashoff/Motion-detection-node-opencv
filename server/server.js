const express = require('express');
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);

server.listen(1234);
app.use(express.static('client'));

require('./socket');

// io.on('connection', );