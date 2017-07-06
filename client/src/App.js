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
      cameraClients:[],
      sensorData: {
        height:0,
        pressure:0,
        temp:0
      }
    }
  }

  componentDidMount() { 
    this.socket.emit('getcameras', true);
    this.socket.on('cameras', data => {
      console.log(data);
      this.setState({
        cameraClients:data
      })
      // console.log(this.state.cameras);
    })
    this.socket.on('sensorData', data => {
      if(data) {
        this.setState({sensorData: JSON.parse(data)})
      }
    })
    

  }

  render() {
    const { height, pressure, temp } = this.state.sensorData;
    return (
      <div className="App">
        <h1>Video control:</h1>
        {this.state.cameraClients.map((cameraClient, i) => {
          return(<div> <h1>CAMERACLIENT {i+1}</h1>
            {cameraClient.map((camera) => {
              return(<SocketPlayer cameraId={camera.id}/>) 
            })}
          </div>)
        })}
        
        <div>
          <h1>Climate control:</h1>
          <h3>Pressure: {(pressure)}</h3>
          <h3>Temp: {(temp)}</h3>
        </div>
      </div>
    );
  }
}

export default socketConnect(App);
// {this.state.cameras.map((camera) => {
//           return(<SocketPlayer cameraId={camera.id}/>) 
//         })}