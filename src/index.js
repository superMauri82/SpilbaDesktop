import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import initialState from './State/initialState'
import storeFactory from './Stores/StoreFactory'

import 'simple-line-icons/css/simple-line-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('spilba')
);
