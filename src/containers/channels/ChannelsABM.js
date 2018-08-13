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

  handleOnToggleActive = (channel) => {
    Channels.toggleActive(channel).then(
      Channels.getAll().then((channels) => {
        this.setState(Object.assign({},{channels}));
      })
    )

  };

  handleOnEdit = (channel) => {
    console.log('handleOnEdit')
  };

  render = () => <ChannelsABM
      channels={this.channels}
      onDelete={this.handleOnDelete}
      onCreate={this.handleOnCreation}
      onToggleActive={this.handleOnToggleActive}
      onEdit={this.handleOnEdit}
      channels={this.state.channels}
    />
};
