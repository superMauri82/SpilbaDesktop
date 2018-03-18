/* eslint-disable */
import React from 'react'
import { v4 } from 'uuid'
import C from './../Actions/Constants'

export const data_sources = (state=[], action) =>{
    switch (action.type){
        case (C.ADD_GRAPHIC):

            return [ 
                     {
                       id: v4(),
                       log: action.log,
                       x_axis: action.x_axis,
                       y_axis: action.y_axis,
                       visible: true
                     }
            ]

        case (C.TOGGLE_DATA_SOURCE_VISIBILITY):
            return state.map( ds =>
                ds.id !== action.ds_id ?
                ds :
                { 
                    ...ds,
                    visible: !ds.visible
                })
            
        default: 
            return state
    }
}

export const zoom = (state={}, action) => {
    switch (action.type){

        case (C.CHANGE_X_ZOOM_EXTENT):
            return { 
                   ...state,
                   zoom_x: action.zoom_x
                }

        case (C.CHANGE_Y_ZOOM_EXTENT):
            return { 
                   ...state,
                   zoom_y: action.zoom_y
                }

        case (C.ADD_GRAPHIC):
            return {
                zoom_x: action.zoom.zoom_x,
                zoom_y: action.zoom.zoom_y
            }

        default: 
            return state
    }
}

export const grafico = (state={}, action) => {
    switch (action.type){

        case (C.ADD_GRAPHIC):
            return { 
                id: action.id,
                data_sources: data_sources([],action),
                zoom: zoom({},action)
            }

        case (C.TOGGLE_DATA_SOURCE_VISIBILITY):
            return ( state.id !== action.id) ? 
                state :
                {
                  ...state,
                  data_sources: data_sources(state.data_sources,action)
                }

        case (C.CHANGE_Y_ZOOM_EXTENT):
        case (C.CHANGE_X_ZOOM_EXTENT):
          
            return (state.id !== action.id) ? 
             state :
             {
                ...state,
                zoom: zoom(state.zoom,action)
             }

        default:
            return state
    }
}


export const graficos = (state=[], action) =>{
    switch (action.type){
        case (C.ADD_GRAPHIC):
            return [
                ...state,
                grafico({},action)
            ]

        case (C.REMOVE_GRAPHIC):
            return state.filter( 
                grf => grf.id !== action.id 
            )

        case (C.ADD_DATA_SOURCE):
        case (C.REMOVE_DATA_SOURCE):
        case (C.TOGGLE_DATA_SOURCE_VISIBILITY):
            return state.map( grf => 
                grafico(grf,action)
            )

        case (C.CHANGE_X_ZOOM_EXTENT):
        case (C.CHANGE_Y_ZOOM_EXTENT):
            return state.map( grf =>            
                grafico(grf,action)
            )


        default: 
            return state
    }
}

