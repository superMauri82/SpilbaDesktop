import React from 'react';
import {Button} from 'reactstrap'
import {NavLink} from 'react-router-dom';

const GenericActions = ({element,onView,onEdit,onDelete,onActivate,onDeactivate,onTrack}) => {

    const _view = false;
    const _edit = (typeof onEdit === 'function');
    const _delete = (typeof onDelete === 'function');
    const _activate = (typeof onActivate === 'function');
    const _deactivate = (typeof onDeactivate === 'function');
    const _track = (typeof onTrack === 'function');

    return (
      <span>
        {_deactivate ? <Button color="secondary" onClick={() => onDeactivate(element)}>Desactivar</Button> : ""}
        {_activate ? <Button color="success" onClick={() => onActivate(element)}>Activar</Button> : ""}
        {_view ? <Button color="info" onClick={() => onView(element) }>Ver</Button> : ""}
        {_edit ? <Button color="warning" onClick={() => onEdit(element)}>Editar</Button> : ""}
        {_track ? <Button color="success"><NavLink to='/pista' style={{"color": "#fff"}} > Generar Cortes </NavLink></Button> : "" }
        {_delete ? <Button color="danger" onClick={() => onDelete(element)}>Eliminar</Button> : ""}
       </span>
     )};
export default GenericActions;
