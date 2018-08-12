import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem
} from 'reactstrap';

function ChannelsDetail({channel}) {
  return  (
    <Card>
      <CardHeader>Channel: {channel.name}</CardHeader>
      <CardBody>
        Description
      </CardBody>
    </Card>
  )
}

export default ChannelsDetail;
