import React from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button
} from 'reactstrap'
import ChannelsListing from './ChannelsListing'
import ChannelsCreation from "../../containers/channels/ChannelsCreation"
import {ChannelsDetail} from "./"
import GenericActions from '../GenericActions'
import { v4 } from 'uuid'


export default class ChannelsABMContainer extends React.Component {
      
  constructor(props) {
    super(props);
    this.state = {
      modalCreation: false,
      modalDetail: false,
      channels:  [
          { id: v4(), name: "satellites",  function:'Data Adquirida' },
          { id: v4(), name: "time",  function:'Data Adquirida' },
          { id: v4(), name: "latitude",  function:'Data Adquirida' },
          { id: v4(), name: "longitude",  function:'Data Adquirida' },
          { id: v4(), name: "velocity kmh",  function:'Data Adquirida' },
          { id: v4(), name: "heading",  function:'Data Adquirida' },
          { id: v4(), name: "height",  function:'Data Adquirida' },
          { id: v4(), name: "Lat. accel",  function:'Data Adquirida' },
          { id: v4(), name: "Long. accel",  function:'Data Adquirida' },
          { id: v4(), name: "Vert. accel",  function:'Data Adquirida' },
          { id: v4(), name: "Gyro X",  function:'Data Adquirida' },
          { id: v4(), name: "Gyro Y",  function:'Data Adquirida' },
          { id: v4(), name: "Gyro Z", function:'Data Adquirida' }
      ]
    };
    this.toggleCreation = this.toggleCreation.bind(this);
    this.toggleDetail   = this.toggleDetail.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }
  
  toggleCreation() {
    this.setState({...this.state, modalCreation: !this.state.modalCreation});
  }
  
  toggleDetail() {
    this.setState({...this.state, modalDetail: !this.state.modalDetail});
  }
  
  handleOnSelect (channel) {
    this.setState({...this.state, channel, modalDetail:true});
  }
  
  render() {
    const {channel,onCreate,onDelete} = this.props;
    const {channels,modalDetail,modalCreation} = this.state;
    
    
    let DetailContent = '';
    if(channel) {
      DetailContent = (
        <Modal isOpen={modalDetail} toggle={this.toggleDetail}>
          <ModalHeader toggle={this.toggleDetail}>Channel: {channel._id}</ModalHeader>
          <ModalBody>
            <ChannelsDetail log={channel} />
            <GenericActions element={channel} onDelete={this.handleOnDelete}/>
          </ModalBody>
        </Modal>
      );
    }
    
    return (
      <div className="container-fluid">
        <div className="animated fadeIn">
          <Button color="info" onClick={this.toggleCreation}>Add</Button>
          <ChannelsListing channels={channels} selected={channel} onSelect={this.handleOnSelect} onDelete={onDelete}  />
          <Modal isOpen={modalCreation} toggle={this.toggleCreation}>
            <ModalHeader toggle={this.toggleCreation}>Create a new Channel</ModalHeader>
            <ModalBody>
              <ChannelsCreation onCreate={onCreate} />
            </ModalBody>
          </Modal>
          {DetailContent}
        </div>
      </div>
    )
  }
}
