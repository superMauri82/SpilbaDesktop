/* eslint_disable */
import React from 'react'
import { v4 } from 'uuid'
import C from './../Actions/Constants'


export const in_session_logs = (state=[], action) =>{
    switch (action.type){
      case (C.ADD_IN_SESSION_LOGS):
        return [
		...state,
		...action.logs.filter( (l,i) => i < 6 )
	]
      case (C.ADD_IN_SESSION_LOG):
        return [ ...state,
                 {
			 _id: action._id,
			 _rev: action._rev,
			 data: action.log.data,
			 tags: action.log.tags
                 }
        ]
      case (C.REMOVE_IN_SESSION_LOG):
        return state.filter( log =>
              log.id_ !== action.id_log
        )

      default:
        return state;
    }
}

export const active_logs = (state=[], action) =>{
    switch (action.type){
      case (C.ADD_IN_SESSION_LOGS): 
        return [
		...state,
		...action.logs.filter( (l,i) => i < 6 ).map( l => { return{
			_id: l._id,
			_rev: l._rev,
			name_log: 'noName',
			color: 'pink',
			x_offset: 0
		}})
	]
      case (C.ACTIVATE_LOG):{
        return [
            ...state,
            {
              _id: action._id,
              _rev: action._rev,
              name_log: action.name_log,
              color: 'red',
              x_offset: 0
            }
        ]
      }
      case (C.DEACTIVATE_LOG):{
        return state.filter( active_log =>
            active_log.id_log !== action.id_log
        )
      }
      case (C.SHIFT_CURVE_X):{
        return state.map( active_log => {
            return active_log.id_log !== action.id_log ?
            active_log : 
            {
              ...active_log,
             x_offset: action.x_offset
            }
        })

        return state.filter( active_log =>
            active_log.id_log !== action.id_log
        )
      }
      default:
          return state;
    }
}

export const channels = (state=[], action) =>{
    switch (action.type){
        case (C.ADD_CHANEL):{
          return [
              ...state,
              {
                  id_channel: v4(),
                  channel_name: action.channel_name,
                  channel_function: x => x
              }
          ]
      }
        case (C.REMOVE_CHANEL):{
          return state.filter(
              ch => ch.id_channel !== action.id_channel
          )
      }
        default: 
          return state;
    }
}

export const active_channels = (state=[], action) =>{
    switch (action.type){
        case (C.ACTIVATE_CHANNEL):{
          return [
              ...state,
              {
                id_channel: action.id_channel,
                zoom: { 
                  zoom_x : action.active_zoom_x,
                  zoom_y : [ 0, Number.MAX_SAFE_INTEGER ]
                }
              }
          ]
      }
        case (C.DEACTIVATE_CHANNEL):{
          return state.filter(
              a_ch => a_ch.id_channel !== action.id_channel
          )
      }
        case (C.CHANGE_X_ZOOM):
        case (C.CHANGE_Y_ZOOM):
            return state.map( a_ch =>            
                active_channel(a_ch,action)
            )

        default: 
          return state;
    }
}

export const active_channel = (state = {} , action ) =>{
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
