import React from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'
import TrackListing from './TrackListing'
import TrackCreation from "../../containers/track/TrackCreation"
import TrackDetail from "./TrackDetail"
import GenericActions from "../GenericActions"

export default class TrackABM extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalCreation: false,
      modalDetail: false,
      track: null
    };

    this.toggleCreation = this.toggleCreation.bind(this);
    this.toggleDetail = this.toggleDetail.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }
  
  toggleCreation() {
    this.setState({modalCreation: !this.state.modalCreation});
  };
  
  toggleDetail () {
    this.setState({modalDetail: !this.state.modalDetail});
  };
  
  handleOnSelect = (track) => {
    this.setState(Object.assign({},this.state,{track,modalDetail:true}));
  };

  render() {
    const {logs,tracks,onCreate,onDelete} = this.props;
    const {track,modalCreation,modalDetail} = this.state;
    
    let DetailContent = '';
    if(track) {
      DetailContent = (
        <Modal isOpen={modalDetail} toggle={this.toggleDetail}>
          <ModalHeader toggle={this.toggleDetail}>Track: {track._id}</ModalHeader>
          <ModalBody>
            <TrackDetail track={track}/>
            <GenericActions element={track} onDelete={onDelete}/>
          </ModalBody>
        </Modal>
      );
    }

    return (
      <div className="container-fluid">
        <div className="animated fadeIn">
          <Button color="info" onClick={this.toggleCreation}>Add</Button>
          <TrackListing tracks={tracks} logs={logs} selected={track} onSelect={this.handleOnSelect}/>

          <Modal isOpen={modalCreation} toggle={this.toggleCreation}>
            <ModalHeader toggle={this.toggleCreation}>Create a new Log</ModalHeader>
            <ModalBody>
              <TrackCreation logs={logs} tracks={tracks} onCreate={onCreate} onDelete={onDelete}/>
            </ModalBody>
          </Modal>
          {DetailContent}
        </div>
      </div>
    )
  }
};