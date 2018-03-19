import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'
import SpilbaGraphic from './../Components/SpilbaGraphic'

const GraficosUI = ({ graficos = [], onChangeZoomX = f=>f }) =>
    <div className="GraficosUI_LIST">
      { graficos.map( (grf,i) => <SpilbaGraphic key={i} {...grf} onChangeZoomX = {onChangeZoomX} /> ) }
    </div>

const GrafContainer = connect(
    state => ({
        graficos: [...state.graficos]
    })
    ,
    dispatch => ({
        onChangeZoomX(id,zoom){
            dispatch(changeXzoomExtent(id,zoom))
        }
    })
)(GraficosUI)

export default GrafContainer;
