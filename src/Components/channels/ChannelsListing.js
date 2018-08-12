import React from 'react';
import {
  Badge,
  Table,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import GenericActions from '../GenericActions';

function ChannelsListingItem({channel,selected,onSelect,onDelete,onEdit,onActivate}) {
  return (
    <tr onClick={() => selected ? '' : onSelect(channel)} >
      <td scope="row">{channel.name}</td>
      <td>{channel.function}</td>
      <td><GenericActions element={channel} onEdit={onEdit} onDelete={onDelete} onActivate={onActivate} /></td>
    </tr>
  );
 }


function ChannelsListing({channels,selected, onSelect, onDelete, onEdit, onActivate}) {
    return (
      <Card>
        <CardHeader>Channels</CardHeader>
        <CardBody>
          <Table striped hover size="sm" >
            <thead>
              <tr>
                <th>Name</th>
                <th>Function</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel)=> <ChannelsListingItem
                key={channel.id}
                filename={channel.filename}
                channel={channel}
                    selected={channel === selected}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onActivate={onActivate}
                  />)}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        )
    }

export default ChannelsListing;
