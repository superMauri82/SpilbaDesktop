import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem
} from 'reactstrap';

function LogDetail({log}) {
  return  (
    <Card>
      <CardHeader>Log: {log.id}</CardHeader>
      <CardBody>
      <ListGroup>
        {log.tags.map((item) => <ListGroupItem key={item}>{item}</ListGroupItem> )}
      </ListGroup>
      </CardBody>
      <textarea value={JSON.stringify(log)} />
    </Card>
  )
}

export default LogDetail;