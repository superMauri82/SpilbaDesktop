import React from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import TagsABM from "../tags/TagABM";

const TrackCreation = ({error,logs,log,start,end,tags,onLogChanged,onStartChanged,onEndChanged,onTagCreation,onTagDeletion,onTrackCreation}) => {
  return (
    <Card>
      <CardHeader>New</CardHeader>
      <CardBody>
        {error!==false ? error : ''}
        <Form>
          
          <FormGroup row>
            <Input
              type="select"
              onChange={ event => {
                if(event.target.value === 'None') {onLogChanged(null)}
                else {onLogChanged(logs[event.target.value])}
              }}
              selected={ log ? log.id : 'None'}
            >
              <option value="None">Select a Log</option>
              {logs.map((aLog,index)=> <option key={index} value={index}>{aLog._id} : {aLog.tags.join(',')}</option> )}
            </Input>
          </FormGroup>
          
          { log ? (
          <div>
            
            <FormGroup row>
              <Label for="tags" sm={2}>Starts</Label>
              <Col sm={10}>
                <Input
                  type="select"
                  onChange={ event => {
                    if(event.target.value === 'None') {onStartChanged(null)}
                    else {onStartChanged(event.target.value)}
                  }}
                  selected={start}
                >
                  <option value='None'>Select an Option</option>
                  {log.data.rows.map((line,index) => <option key={index} value={index}>{index}</option> )}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="tags" sm={2}>Ends</Label>
              <Col sm={10}>
                <Input
                  type="select"
                  disabled={start === null}
                  onChange={ event => {
                    if(event.target.value === 'None') {onEndChanged(null)}
                    else {onEndChanged(event.target.value)}
                  }}
                  selected={end}>
                  <option value='None'>Select an Option</option>
                  {log.data.rows.map((log,index) => {
                    if( index > start) {
                      return <option key={index} value={index}>{index}</option>
                    }
                  })}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="tags" sm={2}>Tags</Label>
              <Col sm={10}>
                <TagsABM tags={tags} onCreate={onTagCreation} onDelete={onTagDeletion}/>
              </Col>
            </FormGroup>

            <Button color="success" disabled={error !== false} onClick={onTrackCreation}><i className='icon-plus' /></Button>
          </div>
          ) : ''}
          
        </Form>
      </CardBody>
    </Card>
  )
};

export default TrackCreation;