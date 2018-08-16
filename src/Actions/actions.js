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

// LOGS Action
export const activateLog = 
    (id,rev) =>
      ({
          type : C.ACTIVATE_LOG,
	  _id  : id,
	  _rev : rev,
          name_log: 'Pista Seca',
          color: 'green',
          x_offset: 0
      })

// LOGS Action
export const addLogs = 
    (logs) =>
      ({
        type : C.ADD_IN_SESSION_LOGS,
	    logs : logs,
      })

// LOGS Action
export const addLog = 
    (id,rev,log) =>
      ({
          type : C.ADD_IN_SESSION_LOG,
	      log  : log,
	      _id  : id,
	      _rev : rev,
      })

// LOGS Action
export const deleteLog = 
    (id_channel, id_log, x_offset) =>
      ({
          id_channel,
          id_log,
          type: C.SHIFT_CURVE_X,
          x_offset
      })


// CHANNELS LOGS Action
export const addLogsAndChannels = 
    (logs,channels) =>
      ({
        type : C.ADD_LOGS_AND_CHANNELS,
	    logs : logs,
        channels: channels
      })
