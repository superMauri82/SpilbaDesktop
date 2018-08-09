import React from 'react';
import {LogABM} from '../../Components/log';
import {Logs} from '../../data/index';

export default class LogABMContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      logs:[]
    }
  }

  handleOnCreation = (log) => {
    Logs.create(log).then(() => {
      Logs.getAll().then((logs) => {
        this.setState(Object.assign({},this.state,{logs}));
      })
    })
  };
  
  componentDidMount = () => {
    Logs.getAll().then((logs) => {
      this.setState(Object.assign({},this.state,{logs}));
    })
  };
  
  handleOnDelete = (log) => {
    Logs.delete(log).then(
      Logs.getAll().then((logs) => {
        this.setState(Object.assign({},{logs}));
      })
    )

  };

  render = () => <LogABM
      onDelete={this.handleOnDelete}
      onCreate={this.handleOnCreation}
      logs={this.state.logs}
    />
};
