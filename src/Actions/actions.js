import C from './Constants'
import { v4 } from 'uuid'

export const addGraphic = 
    (log, x_axis, y_axis, zoom ) => 
      ({
          id: v4(),
          type: C.ADD_GRAPHIC,
          log,
          x_axis,
          y_axis,
          zoom
      })

export const removeGraphic = 
    id =>
      ({
          id,
          type: C.REMOVE_GRAPHIC
      })


export const changeXzoomExtent = 
    ( id, zoom_x=[0,0] ) =>
      ({
          id,
          type: C.CHANGE_X_ZOOM_EXTENT,
          zoom_x
      })

export const changeYzoomExtent = 
    ({ id, zoom_y=[0,0] }) =>
      ({
          id,
          type: C.CHANGE_Y_ZOOM_EXTENT,
          zoom_y
      })

export const toggleDataSourceVisibility = 
    (id,ds_id)=>
    ({
        id,
        ds_id,
        type: C.TOGGLE_DATA_SOURCE_VISIBILITY
    })
