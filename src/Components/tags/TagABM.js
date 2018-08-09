import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem} from 'reactstrap';

class TagCreation extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {tag:''};
    }

    handleCreate = (event) => {
        this.props.onCreate(this.state.tag);
        this.setState({tag:''});
        event.preventDefault();
    };

    handleChange = (event) => {
        this.setState({ tag: event.target.value })
    };
    
    render() {
      return (
        <label>
          <input type="text" onChange={this.handleChange} value={this.state.tag}/>
          <button onClick={this.handleCreate}>+</button>
        </label>
      )
    }
}

TagCreation.propTypes = {
    onCreate: PropTypes.func,
};

class TagABM  extends React.Component {
    
    render() {
      return (
        <div>
          <TagCreation onCreate={this.props.onCreate} />
          <ListGroup>
            {this.props.tags.map((tag) => <ListGroupItem key={tag}>{tag} <button onClick={() => this.props.onDelete(tag)}>X</button></ListGroupItem>)}
          </ListGroup>
        </div>
      )
    }
}

TagABM.propTypes = {
    onCreate: PropTypes.func,
    onDelete: PropTypes.func
};

export default TagABM
