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

export default class ChannelsABMContainer extends React.Component {
      
  constructor(props) {
    super(props);
    this.state = {
      modalCreation: false,
      modalDetail: false,
      channel: null 
    };
    this.toggleCreation     = this.toggleCreation.bind(this);
    this.toggleDetail       = this.toggleDetail.bind(this);
    this.handleOnSelect     = this.handleOnSelect.bind(this);
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
    const {channels,onCreate,onToggleActive,onDelete,onEdit} = this.props;
    const {channel,modalDetail,modalCreation} = this.state;
    
    
//    let DetailContent = '';
//    if(channel) {
//      DetailContent = (
//        <Modal isOpen={modalDetail} toggle={this.toggleDetail}>
//          <ModalHeader toggle={this.toggleDetail}>Channel: {channel._id}</ModalHeader>
//          <ModalBody>
//            <ChannelsDetail log={channel} />
//            <GenericActions element={channel} onDelete={this.handleOnDelete}/>
//          </ModalBody>
//        </Modal>
//      );
//    }
    
    return (
      <div className="container-fluid">
        <div className="animated fadeIn">
          <Button color="info" onClick={this.toggleCreation}>Add</Button>
          <ChannelsListing 
            channels={channels} 
            selected={channel} 
            onEdit={onEdit} 
            onToggleActive={onToggleActive} 
            onSelect={this.handleOnSelect} 
            onDelete={onDelete} 
          />
          <Modal isOpen={modalCreation} toggle={this.toggleCreation}>
            <ModalHeader toggle={this.toggleCreation}>Create a new Channel</ModalHeader>
            <ModalBody>
              <ChannelsCreation onCreate={onCreate} />
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}
