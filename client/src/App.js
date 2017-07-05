import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { socketConnect } from 'socket.io-react';
import './App.css';
import base64_arraybuffer from 'base64-arraybuffer';


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.socket = props.socket;
  }


  componentDidMount() {
    var img = new Image();
    let canvas = ReactDOM.findDOMNode(this.refs.camera);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#333';
    ctx.fillText('Loading', canvas.width/2-30, canvas.height/3);
    

    this.socket.on('camera', data => {
      let base64String = base64_arraybuffer.encode(data.buffer);
      img.onload = function () {
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
      };
      img.src = 'data:image/png;base64,' + base64String;
    })

  }


  render() {
    return (
      <div className="App">
        <canvas width={640} height={480} ref="camera" />
      </div>
    );
  }
}

export default socketConnect(App);
