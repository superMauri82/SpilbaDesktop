import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import { changeXzoomExtent, shiftCurveX } from './../Actions/actions'
import SpilbaGraphic from './../Components/SpilbaGraphic'
import zipWith from 'lodash/zipWith'
import sortBy from 'lodash/sortBy'
import isUndefined from 'lodash/isUndefined'
import GraphicShifter from './GraphicShifter'

const GraficosUI = ({ active_logs=[], active_channels=[], onChangeZoomX = f=>f, onShiftCurve = f=>f }) =>
    { 
      return (
        <div className="GraficosUI_LIST">
          <GraphicShifter  colors={ active_logs.map( acl => ({ color: acl.color, id_log: acl._id, name_log: acl.name_log}))} />
          { active_channels.map( (ach,i) => <SpilbaGraphic key={i} {...ach} active_logs={active_logs} onChangeZoomX={onChangeZoomX} onShiftCurve={onShiftCurve} /> ) }
        </div>
     )}

const GrafContainer = connect(
    state => ({

        active_logs: zipWith(
                       sortBy([...state.in_session_logs], isl => isl._id),
                       sortBy([...state.active_logs],acl => acl._id), 
                       (isl,acl) => ({ ...isl, ...acl })
                     ).filter( zlog => !isUndefined(zlog.x_offset) ),

        active_channels: zipWith(
                       sortBy([...state.channels], chn => chn._id),
                       sortBy([...state.active_channels],ach => ach._id), 
                       (chn,ach) => ({ ...chn, ...ach })
                     )

    })
    ,
    dispatch => ({
        onChangeZoomX(id,zoom){
            dispatch(changeXzoomExtent(id,zoom))
        },
        onShiftCurve(id_channel,id_log,xOffset){
            dispatch(shiftCurveX(id_channel,id_log,xOffset))
        }
    })
)(GraficosUI)

export default GrafContainer;
