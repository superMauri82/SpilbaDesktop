import { createStore, 
         combineReducers,
         applyMiddleware } from 'redux'

import thunk from 'redux-thunk'

import { 
    logs,
    channels
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
    return result
}

const storeFactory = (initialState=stateData) => 
    //applyMiddleware(thunk)(createStore)(
    applyMiddleware(thunk,logger,saver)(createStore)(
        combineReducers({ 
            logs,
            channels
        }),
       stateData
    )

export default storeFactory
