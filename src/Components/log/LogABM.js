import React from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button
} from 'reactstrap'
import LogListing from './LogListing'
import LogCreation from "../../containers/log/LogCreation"
import {LogDetail} from "./"
import GenericActions from '../GenericActions'



export default class LogABMContainer extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalCreation: false,
      modalDetail: false,
      log: null
    };
    this.toggleCreation = this.toggleCreation.bind(this);
    this.toggleDetail   = this.toggleDetail.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }
  
  toggleCreation() {
    this.setState({...this.state, modalCreation: !this.state.modalCreation});
  }
  
  toggleDetail () {
    this.setState({...this.state, modalDetail: !this.state.modalDetail});
  }
  
  handleOnSelect (log) {
    this.setState({...this.state, log, modalDetail:true});
  }

  render() {
    const {logs,onCreate,onDelete} = this.props;
    const {log,modalDetail,modalCreation} = this.state;
    
    
    let DetailContent = '';
    if(log) {
      DetailContent = (
        <Modal isOpen={modalDetail} toggle={this.toggleDetail}>
          <ModalHeader toggle={this.toggleDetail}>Log: {log._id}</ModalHeader>
          <ModalBody>
            <LogDetail log={log} />
            <GenericActions element={log} onDelete={this.handleOnDelete}/>
          </ModalBody>
        </Modal>
      );
    }
    
    return (
      <div className="container-fluid">
        <div className="animated fadeIn">
          <Button color="info" onClick={this.toggleCreation}>Add</Button>
          <LogListing logs={logs} selected={log} onSelect={this.handleOnSelect} onDelete={onDelete} onTrack={ x=>x }  />
  
          <Modal isOpen={modalCreation} toggle={this.toggleCreation}>
            <ModalHeader toggle={this.toggleCreation}>Create a new Log</ModalHeader>
            <ModalBody>
              <LogCreation onCreate={onCreate} />
            </ModalBody>
          </Modal>
          {DetailContent}
        </div>
      </div>
    )
  }
}
