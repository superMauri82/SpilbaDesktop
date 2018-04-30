import React from 'react';
import {
  Card,
  CardHeader
} from 'reactstrap';

function TrackDetail({track}) {
  return (
    <Card>
      <CardHeader>Detail</CardHeader>
      <textarea value={JSON.stringify(track)} />
    </Card>
  )
}

export default TrackDetail;