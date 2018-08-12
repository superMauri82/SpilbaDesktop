import React from 'react';
import {ChannelsCreation}   from "../../Components/channels";

const DefaultError = 'Please, fill the form';

const DefaultState = {
  channel: null
};

class ChannelsCreationContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = DefaultState;
    this.handleOnSave.bind(this);
  }
  

  handleChannelCreation = tag => {
    if(this.state.tags.indexOf(tag) === -1) {
      this.setState(Object.assign({},this.state,{tags:this.state.tags.concat([tag])}))
    }
  };

  handleChannelDeletion = tag => {
  };
  
  handleOnSave = event => {
    //this.props.onCreate({data:this.state.log,tags:this.state.tags,filename:this.state.filename});
    this.setState(Object.assign({},DefaultState));
  };
  


  render() {
    const error = false    

    return <ChannelsCreation
      channel={this.state.channel}
      error={error}
      onSave={this.handleOnSave.bind(this)}
      onChannel={this.handleChannelCreation.bind(this)}
      onChannelDeletion={this.handleChannelDeletion.bind(this)}
    />
  }
}

export default ChannelsCreationContainer;
