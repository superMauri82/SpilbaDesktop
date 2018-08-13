import React from 'react';
import {Button} from 'reactstrap'


const GenericActions = ({element,onView,onEdit,onDelete,onActivate,onDeactivate}) => {

    const _view = (typeof onView === 'function');
    const _edit = (typeof onEdit === 'function');
    const _delete = (typeof onDelete === 'function');
    const _activate = (typeof onActivate === 'function');
    const _deactivate = (typeof onDeactivate === 'function');

    return (
      <span>
        {_deactivate ? <Button color="secondary" onClick={() => onDeactivate(element)}>Deactivate</Button> : ""}
        {_activate ? <Button color="success" onClick={() => onActivate(element)}>Activate</Button> : ""}
        {_view ? <Button color="info" onClick={() => onView(element) }>View</Button> : ""}
        {_edit ? <Button color="warning" onClick={() => onEdit(element)}>Edit</Button> : ""}
        {_delete ? <Button color="danger" onClick={() => onDelete(element)}>Delete</Button> : ""}
      </span>
    )
};

export default GenericActions;
