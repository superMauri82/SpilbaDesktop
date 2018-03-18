import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'

const GraficoUI = ({ data_sources = [], zoom={} }) =>
    <div className="GraficoUI">
        <h2>Recibi estos data sources: </h2>
        <ul>
          { data_sources.map( (ds,i) => <li key={i}> File: {ds.log} <span>X: {ds.x_axis}</span> <span>Y: {ds.y_axis}</span></li> ) }
        </ul>
        <p>
          Con este nivel de zoom: 
          { zoom.zoom_x.reduce((acc,el) => `${acc} .. ${el}`,'') }
        </p>
    </div>

const GraficosUI = ({ graficos = [], onChangeZoomX = f=>f }) =>
    <div className="GraficosUI_LIST">
      { graficos.map( (grf,i) => <GraficoUI key={i} {...grf} /> ) }
      <button onClick={ () => onChangeZoomX(Math.ceil(Math.random()*2),[Math.ceil(Math.random()*100),323]) }>Cambiar Zoom</button>
    </div>

const GrafContainer = connect(
    state => ({
        graficos: [...state.graficos]
    })
    ,
    dispatch => ({
        onChangeZoomX(id,zoom=[]){
            dispatch(changeXzoomExtent(id,zoom))
        }
    })
)(GraficosUI)

export default GrafContainer;
