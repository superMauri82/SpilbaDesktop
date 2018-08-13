import React from 'react';
import {
  Badge,
  Table,
  Card,
  CardBody,
  CardHeader,
  Button,
} from 'reactstrap';
import GenericActions from '../GenericActions';

function ChannelsListingItem({channel,selected,onSelect,onDelete,onEdit,onToggleActive}) {


  return (
    <tr onClick={() => selected ? '' : onSelect(channel)} >
      <td scope="row">{channel.name}</td>
      <td>{channel.function}</td>
        { channel.active ? (
            <td>
              <GenericActions element={channel} onEdit={onEdit} onDeactivate={onToggleActive} />
            </td>
          ) : (
            <td>
              <GenericActions element={channel} onEdit={onEdit} onActivate={onToggleActive} />
            </td>
        )}
        { channel.active ? (
            <td>
              <Badge color="success" pill>
                  <i className='icon-chart' /> 
              </Badge>
            </td>
          ) : (
            <td>
              <Badge color="secondary" pill>
                  <i className='icon-shield' /> 
              </Badge>
            </td>
        )}
    </tr>
  );
 }


function ChannelsListing({channels,selected, onSelect, onDelete, onEdit, onToggleActive}) {
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel)=> <ChannelsListingItem
                key={channel._id}
                filename={channel.filename}
                channel={channel}
                    selected={channel === selected}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleActive={onToggleActive}
                  />)}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        )
    }

export default ChannelsListing;
