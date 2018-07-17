import { createStore, 
         combineReducers,
         applyMiddleware } from 'redux'

import { 
    in_session_logs,
    active_logs,
    channels,
    active_channels 
} from  './../Reducers/reducers'
import stateData from './../State/initialState'

const logger = store => next => action => {
    let result
    console.groupCollapsed("dispatching", action.type)
    console.log('prev state', store.getState())
    console.log('action',action)
    result = next(action)
    console.log('next state', store.getState())
    console.groupEnd()
}

const saver = store => next => action => {
    let result = next(action)
    //localStorage['redux-store'] = JSON.stringify(store.getState())
    return result
}

const storeFactory = (initialState=stateData) => 
    applyMiddleware(logger, saver)(createStore)(
        combineReducers({ 
            in_session_logs,
            active_logs,
            channels,
            active_channels
        }),
        //(localStorage['redux-store']) ?
         //   JSON.parse(localStorage['redux-store']) :
            stateData
    )

export default storeFactory
