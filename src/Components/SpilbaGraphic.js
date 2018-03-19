import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'

class SpilbaGraphic extends Component{
    constructor(props){
        super(props)
        const { id, data_sources, zoom, onChangeZoomX } = props
        this.data_sources  = data_sources
        this.zoom          = zoom
        this.id            = id
        this.onChangeZoomX = onChangeZoomX
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
        const { data_sources, zoom } = nextProps
        this.data_sources = data_sources
        this.zoom         = zoom
    }

    componentWillUpdate(nextProps, nextState){
    }

    componentDidUpdate(prevProps, prevState){
    }

    render(){
        return (
          <div className="GraficoUI">
              <h2>Recibi estos data sources: </h2>
              <ul>
                { this.data_sources.map( (ds,i) => <li key={i}> File: {ds.log} <span>X: {ds.x_axis} </span> <span>Y: {ds.y_axis}</span></li> ) }
              </ul>
              <p>
                Con este nivel de zoom: 
                { this.zoom.zoom_x.reduce((acc,el) => `${acc} .. ${el}`,'') }
              </p>
              <button onClick={ () => this.onChangeZoomX(  this.id ,[Math.ceil(Math.random()*100),323]) }>Cambiar Zoom</button>
              <svg id={ `Spilba-Graphic-Targe-${this.id}` } width="1000" height="500"></svg>
          </div>
        )
    }
}



export default SpilbaGraphic;
