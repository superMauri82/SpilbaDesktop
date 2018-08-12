import React from 'react';
import {ChannelsABM} from '../../Components/channels';
import {Channels} from '../../data/index';

export default class ChannelsABMContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      channels:[]
    }
  }

  handleOnCreation = (channel) => {
    Channels.create(channel).then(() => {
      Channels.getAll().then((channels) => {
        this.setState(Object.assign({},this.state,{channels}));
      })
    })
  };
  
  componentDidMount = () => {
    Channels.getAll().then((channels) => {
      this.setState(Object.assign({},this.state,{channels}));
    })
  };
  
  handleOnDelete = (channel) => {
    Channels.delete(channel).then(
      Channels.getAll().then((channels) => {
        this.setState(Object.assign({},{channels}));
      })
    )

  };

  render = () => <ChannelsABM
      onDelete={this.handleOnDelete}
      onCreate={this.handleOnCreation}
      channels={this.state.channels}
    />
};
