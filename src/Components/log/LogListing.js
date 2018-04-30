import React from 'react';
import {
  Badge,
  Table,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import GenericActions from '../GenericActions';

function LogListingItem({log,selected,onSelect,onDelete,onEdit}) {
  return (
    <tr onClick={() => selected ? '' : onSelect(log)} >
      <th scope="row"><small>{log._id}</small></th>
      <td>{log.data.board + ' ' + log.data.version}</td>
      <td>{log.tags.map((tag,index) => <Badge key={index} color="secondary" pill>{tag}</Badge> )}</td>
      <td><GenericActions element={log} onView={onSelect} onEdit={onEdit} onDelete={onDelete} /></td>
    </tr>
  );
 }


function LogListing({logs,selected, onSelect, onDelete, onEdit}) {
    return (
      <Card>
        <CardHeader>Logs</CardHeader>
        <CardBody>
          <Table striped hover size="sm" >
            <thead>
              <tr>
                <th>#</th>
                <th>Source</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log)=> <LogListingItem
                key={log._id}
                log={log}
                selected={log === selected}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
              />)}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )
}

export default LogListing;