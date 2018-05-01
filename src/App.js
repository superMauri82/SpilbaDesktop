import React, { Component } from 'react';
import logo from './images/LOGO_SPILBA.png';
import './App.css';
import NotFoundPage from './pages/errors/notfound';
import IndexPage from './pages/index';
import DashboardPage from './pages/dashboard';
import TracksPage from './pages/tracks';
import LogsPage from './pages/logs';
import PistaPage from './pages/pista';
import SessionsPage from './pages/sessions';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

//class App extends Component {
//  render() {
//    return (
//      <div className="App">
//        <div className="App-header">
//          <img src={logo} className="App-logo" alt="logo" />
//          <h2>Welcome to Spilba</h2>
//        </div>
//        <p className="App-intro">
//          Spilba Electron!!!
//        </p>
//      </div>
//    );
//  }
//}

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={'/dashboard'}      component={DashboardPage} />
          <Route path={'/logs'}           component={LogsPage} />
          <Route path={'/tracks'}         component={TracksPage} />
          <Route path={'/sessions'}       component={SessionsPage} />
          <Route path={'/pista'}          component={PistaPage} />
          <Route path={'/'}               component={IndexPage} />
          <Route                          component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App
