import React from 'react';
import {Button} from 'reactstrap'


const GenericActions = ({element,onView,onEdit,onDelete}) => {

    const _view = (typeof onView === 'function');
    const _edit = (typeof onEdit === 'function');
    const _delete = (typeof onDelete === 'function');

    return (
      <span>
        {_view ? <Button color="info" onClick={() => onView(element) }>view</Button> : ""}
        {_edit ? <Button color="warning" onClick={() => onEdit(element)}>edit</Button> : ""}
        {_delete ? <Button color="danger" onClick={() => onDelete(element)}>delete</Button> : ""}
      </span>
    )
};

export default GenericActions;