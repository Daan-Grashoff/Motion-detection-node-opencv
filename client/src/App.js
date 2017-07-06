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
      cameras:2,
      sensorData: {
        height:0,
        pressure:0,
        temp:0
      }
    }
    
  }

  componentDidMount() { 
    // this.socket.on('cameras', count => {
    //   this.setState({
    //     cameras:count.count
    //   })
    //   console.log(count);
    // })
    this.socket.on('sensorData', data => {
      this.setState({sensorData: JSON.parse(data)})
      console.log(this.state);
    })
    

  }

  render() {
    const { height, pressure, temp } = this.state.sensorData;
    return (
      <div className="App">
        {[...Array(this.state.cameras + 1)].map((_, n) => {
          console.log(n);
          return(<SocketPlayer cameraId={n}/>) 
        })}

        <div>
          <h1>STEFANS DATA:</h1>
          <h3>Height: {parseInt(height)}</h3>
          <h3>Pressure: {parseInt(pressure)}</h3>
          <h3>Temp: {parseInt(temp)}</h3>
        </div>
      </div>

    );
  }
}

export default socketConnect(App);
