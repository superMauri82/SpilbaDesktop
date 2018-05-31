import C from './Constants'
import { v4 } from 'uuid'

export const changeXzoomExtent = 
    ( id_channel, zoom_x=[0,0] ) =>
      ({
          id_channel,
          type: C.CHANGE_X_ZOOM,
          zoom_x
      })

export const changeYzoomExtent = 
    ({ id_channel, zoom_y=[0,0] }) =>
      ({
          id_channel,
          type: C.CHANGE_Y_ZOOM,
          zoom_y
      })

export const shiftCurveX = 
    (id_channel, id_log, x_offset) =>
      ({
          id_channel,
          id_log,
          type: C.SHIFT_CURVE_X,
          x_offset
      })
