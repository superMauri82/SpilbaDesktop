import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import { changeXzoomExtent, shiftCurveX, addLogsAndChannels } from './../Actions/actions'
import SpilbaGraphic from './../Components/SpilbaGraphic'
import zipWith from 'lodash/zipWith'
import sortBy from 'lodash/sortBy'
import isUndefined from 'lodash/isUndefined'
import GraphicShifter from './GraphicShifter'
import {Logs, Channels} from '../data/index';
import { schemeCategory10 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3-scale'


class GraficosUI extends React.Component{
    constructor(props){
      super(props)
      console.log('GraficosUI::Constructor()')
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
	  this.colors          = scaleOrdinal(schemeCategory10)
    }
    componentDidMount(){
      console.log('GraficosUI::componentDidMount()')
      this.fetchActiveLogs()
    }
    
    componentWillUpdate(){
      console.log('GraficosUI::componentWillUpdate()')
    }

    componentWillReceiveProps(nextProps){
      console.log('GraficosUI::componentWillReceiveProps()')
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
          <GraphicShifter  colors={ this.active_logs.map( (acl,i) => ({ color: this.colors(i), id_log: acl._id, name_log: acl.filename}))} />
          { this.active_channels.map( (ach,i) => <SpilbaGraphic key={i} {...ach} active_logs={this.active_logs} onChangeZoomX={this.onChangeZoomX} onShiftCurve={this.onShiftCurve} colors={this.colors}/> ) }
        </div>
     )}
}

const GrafContainer = connect(
    state => ({ 
        active_logs: [...state.logs.filter(log => log.active )],
        active_channels: [...state.channels.filter(chn => chn.active )]
    })
    ,
    dispatch => ({
        fetchActiveLogs(){
           Logs.getAll().then((logs) => {
               Channels.getAll().then((channels) => {
                   dispatch(addLogsAndChannels(logs,channels))
               })
           })
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
