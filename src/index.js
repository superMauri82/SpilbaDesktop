import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import GrafContainer from './Components/Graficos'
import initialState from './State/initialState'
import storeFactory from './Stores/StoreFactory'


const store = storeFactory()

ReactDOM.render(
  <GrafContainer store={store} />,
  document.getElementById('root')
);
