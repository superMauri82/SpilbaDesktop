import React, { Component } from 'react';
import logo from './images/LOGO_SPILBA.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Spilba</h2>
        </div>
        <p className="App-intro">
          Spilba Electron!!!
        </p>
      </div>
    );
  }
}

export default App;
