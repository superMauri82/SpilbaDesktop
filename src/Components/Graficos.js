import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import { changeXzoomExtent, shiftCurveX, addLogs } from './../Actions/actions'
import SpilbaGraphic from './../Components/SpilbaGraphic'
import zipWith from 'lodash/zipWith'
import sortBy from 'lodash/sortBy'
import isUndefined from 'lodash/isUndefined'
import GraphicShifter from './GraphicShifter'
import {Logs} from '../data/index';
import { schemeCategory10 } from 'd3-scale-chromatic'


class GraficosUI extends React.Component{
    constructor(props){
        super(props)
        const { 
	    active_logs,
	    active_channels,
	    onChangeZoomX,
	    onShiftCurve,
	    fetchActiveLogs
        } = props

        this.active_logs     = active_logs
        this.active_channels = active_channels
        this.onChangeZoomX   = onChangeZoomX
        this.onShiftCurve    = onShiftCurve
        this.fetchActiveLogs = fetchActiveLogs 
    }
    componentDidMount(){
      console.log('GraficosUI::componentDidMount()')
      this.fetchActiveLogs()
    }
    
    componentWillUpdate(){
      console.log('GraficosUI::componentWillUpdate()')
    }

    componentWillReceiveProps(nextProps){
        const { 
	    active_logs,
	    active_channels
	} = nextProps

        this.active_logs     = active_logs
        this.active_channels = active_channels
    }
    
    render(){
      return (
        <div className="GraficosUI_LIST">
          <GraphicShifter  colors={ this.active_logs.map( acl => ({ color: acl.color, id_log: acl._id, name_log: acl.name_log}))} />
          { this.active_channels.map( (ach,i) => <SpilbaGraphic key={i} {...ach} active_logs={this.active_logs} onChangeZoomX={this.onChangeZoomX} onShiftCurve={this.onShiftCurve} /> ) }
        </div>
     )}
}

const GrafContainer = connect(
    state => { console.log('ASTUR'); console.log(state); return {

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

    }}
    ,
    dispatch => ({
        fetchActiveLogs(){
           Logs.getAll().then((logs) => {
             dispatch(addLogs(logs))
           }
         )
	},
        onChangeZoomX(id,zoom){
            dispatch(changeXzoomExtent(id,zoom))
        },
        onShiftCurve(id_channel,id_log,xOffset){
            dispatch(shiftCurveX(id_channel,id_log,xOffset))
        }
    })
)(GraficosUI)

export default GrafContainer;
