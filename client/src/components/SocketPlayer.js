import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { socketConnect } from 'socket.io-react';
import base64_arraybuffer from 'base64-arraybuffer';


class SocketPlayer extends Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    // console.log(this.props.cameraId);
  }

  componentDidMount() {
    var img = new Image();
    let canvas = ReactDOM.findDOMNode(this.refs.camera);
    let ctx = canvas.getContext('2d');
    let { cameraId } = this.props
    ctx.fillStyle = '#333';
    ctx.fillText('Loading', canvas.width / 2 - 30, canvas.height / 3);


    this.socket.on(`camera${cameraId}`, data => {
      let base64String = base64_arraybuffer.encode(data);
      img.onload = function () {
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
      };
      img.src = 'data:image/png;base64,' + base64String;
    })

  }

  render() {
    return(
      <canvas style={{marginLeft:20}} width={640} height={480} ref="camera" />
    )
  }
}

export default socketConnect(SocketPlayer);