import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'
import SpilbaGraphic from './../Components/SpilbaGraphic'
import zipWith from 'lodash/zipWith'
import sortBy from 'lodash/sortBy'
import isUndefined from 'lodash/isUndefined'
import GraphicShifter from './GraphicShifter'

const GraficosUI = ({ active_logs=[], active_channels=[], onChangeZoomX = f=>f }) =>
    { 
      return (
        <div className="GraficosUI_LIST">
          <GraphicShifter  colors={ active_logs.map( acl => ({ color: acl.color, id_log: acl.id_log , name_log: acl.name_log}))} />
          { active_channels.map( (ach,i) => <SpilbaGraphic key={i} {...ach} active_logs={active_logs} onChangeZoomX={onChangeZoomX} /> ) }
        </div>
     )}

const GrafContainer = connect(
    state => ({

        active_logs: zipWith(
                       sortBy([...state.in_session_logs], isl => isl.id_log),
                       sortBy([...state.active_logs],acl => acl.id_log), 
                       (isl,acl) => ({ ...isl, ...acl })
                     ).filter( zlog => !isUndefined(zlog.x_offset) ),

        active_channels: [...state.active_channels]

    })
    ,
    dispatch => ({
        onChangeZoomX(id,zoom){
            dispatch(changeXzoomExtent(id,zoom))
        }
    })
)(GraficosUI)

export default GrafContainer;
