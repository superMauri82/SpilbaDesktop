import React from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap';
import TagsABM from "../tags/TagABM";

const LogCreation = ({error,boards,board,onBoardChange,onFileChange,tags,onTagCreation,onTagDeletion,onSave}) => {
  const errorMSG = error !== false ? <b>{error}</b> : '';
  return (
    <Form>
      { errorMSG }
      <FormGroup row>
        <Label for="logBoard" sm={2}>Board</Label>
        <Col sm={10}>
          <Input
            type="select"
            id="logBoard"
            sm={10}
            onChange={(event) => {
              const boardId = parseInt(event.target.value);
              boards.map(aBoard => boardId === aBoard.id ? onBoardChange(aBoard) : '');
            }}
            placeholder="Select your Board"
          >
            <option value={null}>Boards</option>
            {boards.map( aBoard => <option key={aBoard.id} value={aBoard.id}>{aBoard.name}</option> )}
          </Input>
        </Col>
      </FormGroup>
    
      <FormGroup row>
        <Label for="logFile" sm={2}>File</Label>
        <Col sm={10}>
          <Input
            type="file"
            sm={10}
            name="log"
            id="logFile"
            disabled={board === null}
            onChange={event => {
              onFileChange(event.target.files[0]);
            }}
          />
          <FormText color="muted">
            This file will be the exported one from previous selected board.
          </FormText>
        </Col>
      </FormGroup>
    
      <FormGroup row>
        <Label for="tags" sm={2}>Tags</Label>
        <Col sm={10}>
          <TagsABM
            tags={tags}
            onCreate={onTagCreation}
            onDelete={onTagDeletion}
          />
        </Col>
      </FormGroup>
      
      <Button color="success" onClick={onSave} disabled={error !== false} ><i className='icon-plus' /></Button>
      
    </Form>
  )
};

export default LogCreation;