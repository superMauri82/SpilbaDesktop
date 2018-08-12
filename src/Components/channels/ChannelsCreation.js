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

const ChannelsCreation = ({error,onSave}) => {
  const errorMSG = error !== false ? <b>{error}</b> : '';
  return (
    <Form>
      { errorMSG }
      <FormGroup row>
        <Label for="channel" sm={2}>Channel</Label>
        <Col sm={10}>
          <input type="text" value={''}/>
        </Col>
      </FormGroup>
    
      <FormGroup row>
        <Label for="function" sm={2}>Function</Label>
        <Col sm={10}>
          <FormText color="muted">
            Enter Function Expression for new Channel Definition            
          </FormText>
        </Col>
      </FormGroup>
    
      <Button color="success" onClick={onSave} disabled={error !== false} ><i className='icon-plus' /></Button>
      
    </Form>
  )
};

export default ChannelsCreation;
