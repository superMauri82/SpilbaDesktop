import React from 'react';
import {
  Badge,
  Table,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import GenericActions from '../GenericActions';



function TrackListingItem({track,selected,onSelect,onDelete}) {
  return (
    <tr key={track.id} onClick={() => onSelect(track)} >
      <th scope="row">{track._id}</th>
      <td>{track.log}</td>
      <td>{track.start}</td>
      <td>{track.end}</td>
      <td>{track.tags.map((tag,index) => <Badge key={index} color="secondary" pill>{tag}</Badge> )}</td>
      <td><GenericActions element={track} onView={onSelect} onDelete={onDelete} /></td>
    </tr>
  );
}


function TrackListing({logs,tracks,selected, onSelect, onDelete}) {
  return (
    <Card>
      <CardHeader>Tracks</CardHeader>
      <CardBody>
        <Table striped hover>
      <tbody>
      <tr>
        <th>#</th>
        <th>Log</th>
        <th>Starts</th>
        <th>Ends</th>
        <th>Tags</th>
        <th>Actions</th>
      </tr>
      {tracks.map((track)=> {
        return <TrackListingItem key={track._id} selected={(track === selected)} onSelect={onSelect} track={track} onDelete={onDelete} />
      })}
      </tbody>
    </Table>
      </CardBody>
    </Card>
  )
}

export default TrackListing;