import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
 
const socket = io.connect('http://localhost:8080');

render(
  <SocketProvider socket={socket}>
    <App />
  </SocketProvider>,
  document.getElementById('root')
);
registerServiceWorker();
