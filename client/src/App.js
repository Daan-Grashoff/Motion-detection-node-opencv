import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { socketConnect } from 'socket.io-react';
import './App.css';
import SocketPlayer from './components/SocketPlayer';


class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.socket = props.socket;
    this.state = {
      cameras:0
    }
  }

  componentDidMount() { 
    this.socket.on('cameras', count => {
      this.setState({
        cameras:count.count
      })
      console.log(count);
    })
    
  }


 

  render() {
    return (
      <div className="App">
        {[...Array(this.state.cameras + 1)].map((_, n) => {
          return(<SocketPlayer cameraId={n}/>) 
        })}
      </div>
    );
  }
}

export default socketConnect(App);
