import React from 'react'
import {TrackABM} from '../../Components/track'
import {Logs,Traks} from '../../data/index';

const DefaultState = {
  logs: [],
  tracks: []
};

export default class TrackABMContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = DefaultState;
    this.handleOnCreate = this.handleOnCreate.bind(this);
    this.handleOnDelete = this.handleOnDelete.bind(this);
  }
  
  loadAll = () => Logs.getAll().then( logs => {
    Traks.getAll().then( tracks => {
      this.setState(Object.assign({},this.state,{logs,tracks}))
    })
  });
  
  componentDidMount = this.loadAll;
  
  handleOnCreate = (track) => {
    Traks.create(track).then(this.loadAll);
  };
  
  handleOnDelete = (track) => {
    this.props.onDelete(track);
  };

  render = () => <TrackABM
      logs={this.state.logs}
      tracks={this.state.tracks}
      onCreate={this.handleOnCreate}
      onDelete={this.handleOnDelete}
    />
};
