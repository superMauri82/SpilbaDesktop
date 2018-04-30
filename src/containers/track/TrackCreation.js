import React from 'react';
import {TrackCreation} from "../../Components/track";

const DefaultError = 'Fill the Form';

const DefaultState = {
  log:null,
  start:null,
  end:null,
  tags:[]
};

export default class TrackCreationContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = DefaultState;
    this.handleTrackCreation = this.handleTrackCreation.bind(this);
    this.handleLogChanged = this.handleLogChanged.bind(this);
    this.handleStartChanged = this.handleStartChanged.bind(this);
    this.handleEndChanged = this.handleEndChanged.bind(this);
    this.handleTagCreation = this.handleTagCreation.bind(this);
    this.handleTagDeletion = this.handleTagDeletion.bind(this);
  }
  
  handleTrackCreation = () => {
    this.props.onCreate({
      ...this.state,
      log: this.state.log._id
    });
    this.setState(Object.assign({}, DefaultState));
  };
  
  handleStartChanged = (start) => {
    this.setState(Object.assign({}, this.state, {start}))
  };
  
  handleEndChanged = (end) => {
    this.setState(Object.assign({}, this.state, {end}))
  };
  
  handleTagCreation = (tag) => {
    if (this.state.tags.indexOf(tag) === -1) {
      this.setState(Object.assign({},this.state,{tags:this.state.tags.concat([tag])}));
    }
  };
  
  handleTagDeletion = (tag) => {
    this.setState((prev) => {
      const state = Object.assign({}, prev);
      state.track.tags.splice(state.track.tags.indexOf(tag), 1);
      return state;
    })
  };
  
  handleLogChanged = (log) => {
    this.setState(Object.assign({}, this.state, {log}));
  };
  
  checkErrors = () => {
    let error = DefaultError;
    if(!this.state.log) {
      error = "Select a Log.";
    } else if(!this.state.start) {
      error = "Select the beggining of this Track";
    } else if(!this.state.end) {
      error = "Select the end of this Track";
    } else if (this.state.tags.length === 0) {
      error = "Tag at least once this Track";
    } else {
      error = false;
    }
    return error;
  };
 
  render() {
    const {logs} = this.props;
    const {log,start,end,tags} = this.state;
    const error = this.checkErrors();
  
    return <TrackCreation
      log={log}
      start={start}
      end={end}
      tags={tags}
      logs={logs}
      error={error}
      onLogChanged={this.handleLogChanged}
      onStartChanged={this.handleStartChanged}
      onEndChanged={this.handleEndChanged}
      onTagCreation={this.handleTagCreation}
      onTagDeletion={this.handleTagDeletion}
      onTrackCreation={this.handleTrackCreation}
    />
  }
}
