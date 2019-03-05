import React from 'react';
import {
  Badge,
  Table,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import GenericActions from '../GenericActions';

function LogListingItem({log,selected,onSelect,onDelete,onEdit,onActivate,onTrack}) {
  return (
    <tr onClick={() => selected ? '' : onSelect(log)} >
      <td scope="row">{log.filename}</td>
      <td>{log.data.board + ' ' + log.data.version}</td>
      <td>{log.tags.map((tag,index) => <Badge key={index} color="secondary" pill>{tag}</Badge> )}</td>
      <td><GenericActions element={log} onView={onSelect} onEdit={onEdit} onDelete={onDelete} onActivate={onActivate} onTrack={onTrack} /></td>
    </tr>
  );
 }


function LogListing({logs,selected, onSelect, onDelete, onEdit, onActivate, onTrack}) {
    return (
      <Card>
        <CardHeader>Logs</CardHeader>
        <CardBody>
          <Table striped hover size="sm" >
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log)=> <LogListingItem
                key={log._id}
                filename={log.filename}
                log={log}
                selected={log === selected}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onTrack={onTrack}
              />)}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )
}

export default LogListing;
