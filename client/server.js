const express = require('express');

const app = express();
const server = require('http').Server(app);
const path = require('path');

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname + '/build/index.html'));
// });
app.use(express.static(path.join(__dirname + '/build')));

server.listen(8080);
app.use(express.static('client'));

// "devDependencies": {
  //   // "react-scripts": "1.0.10"
  // },

  // "build": "react-scripts build",
    // "test": "react-scripts test --env=jsdom",
    // "eject": "react-scripts eject"