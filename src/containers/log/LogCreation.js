import React from 'react';
import {LogCreation}   from "../../Components/log";
import {fromFileFactory} from "../../library/boards";
import {Boards} from '../../data';

const DefaultError = 'Please, fill the form';

const DefaultState = {
  board: null,
  log: null,
  tags: []
};

class LogCreationContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = DefaultState;
    this.handleOnSave.bind(this);
  }
  
  handleBoardChange = board => {
    this.setState(Object.assign({},this.state,{board}));
  };

  handleTagCreation = tag => {
    if(this.state.tags.indexOf(tag) === -1) {
      this.setState(Object.assign({},this.state,{tags:this.state.tags.concat([tag])}))
    }
  };

  handleTagDeletion = tag => {
    const position = this.state.tags.indexOf(tag); 
    this.setState(Object.assign({},this.state,{tags:this.state.tags.slice().splice(position,1)}))
  };
  
  handleFileChange = async file => {
    if(file) {
      this.setState(Object.assign({},{log:await fromFileFactory(this.state.board,file)}));
    }
  };

  handleOnSave = event => {
    this.props.onCreate({data:this.state.log,tags:this.state.tags});
    this.setState(Object.assign({},DefaultState));
  };
  
  checkErrors = () => {
    let error = DefaultError;
    if(!this.state.board) {
      error = "Select a Board.";
    } else if(!this.state.log) {
      error = "Select a log File";
    } else if (this.state.tags.length === 0) {
      error = "At least one Tag";
    } else {
      error = false;
    }
    return error;
  };

  render() {
    const error = this.checkErrors();
    
    return <LogCreation
      boards={Boards}
      board={this.state.board}
      tags={this.state.tags}
      error={error}
      onSave={this.handleOnSave.bind(this)}
      onFileChange={this.handleFileChange.bind(this)}
      onBoardChange={this.handleBoardChange.bind(this)}
      onTagCreation={this.handleTagCreation.bind(this)}
      onTagDeletion={this.handleTagDeletion.bind(this)}
    />
  }
}

export default LogCreationContainer;
