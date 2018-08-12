import React, { Component } from 'react';
import logo from './images/logo.png';
import './App.css';
import NotFoundPage from './pages/errors/notfound';
import IndexPage from './pages/index';
import DashboardPage from './pages/dashboard';
import TracksPage from './pages/tracks';
import LogsPage from './pages/logs';
import PistaPage from './pages/pista';
import SessionsPage from './pages/sessions';
import ChannelsPage from './pages/channels';

import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={'/dashboard'}      component={DashboardPage} />
          <Route path={'/logs'}           component={LogsPage} />
          <Route path={'/tracks'}         component={TracksPage} />
          <Route path={'/sessions'}       component={SessionsPage} />
          <Route path={'/channels'}       component={ChannelsPage} />
          <Route path={'/'}               component={IndexPage} />
          <Route                          component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App
