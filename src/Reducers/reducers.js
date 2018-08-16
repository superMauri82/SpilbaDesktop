/* eslint_disable */
import React from 'react'
import { v4 } from 'uuid'
import C from './../Actions/Constants'


export const logs = (state=[], action) =>{
    switch (action.type){
      case (C.ADD_LOGS_AND_CHANNELS):
        return [
		  ...action.logs
	    ]
      default:
        return state;
    }
}

//      case (C.SHIFT_CURVE_X):{
//        return state.map( active_log => {
//            return active_log.id_log !== action.id_log ?
//            active_log : 
//            {
//              ...active_log,
//             x_offset: action.x_offset
//            }
//        })
//}

export const channels = (state=[], action) =>{
    switch (action.type){
      case (C.ADD_LOGS_AND_CHANNELS):
        return [
              ...action.channels
	    ]
        case (C.CHANGE_X_ZOOM):
        case (C.CHANGE_Y_ZOOM):
          return state.map( a_ch =>            
            channel(a_ch,action)
          )

        case (C.REMOVE_CHANEL):{
          return state.filter(
              ch => ch.id_channel !== action.id_channel
          )
      }
        default: 
          return state;
    }
}

export const channel = (state = {} , action ) =>{
    switch (action.type){
        case (C.CHANGE_X_ZOOM):{
            return {
                ...state,
                id_channel: action.id_channel,
                zoom: { 
                    ...state.zoom,
                    zoom_x: action.zoom_x
                }
            }
        }
    }
}

