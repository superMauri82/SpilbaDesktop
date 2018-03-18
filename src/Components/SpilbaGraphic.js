import React, { Component } from 'react'
import { connect } from 'react-redux'

class SpilbaGraphic extends Component{
    constructor(props){
        super(props)
        console.log(props)
        const { data_sources, zoom } = props
        this.data_sources = data_sources
        this.zoom         = zoom
    }

    componentWillReceiveProps(nextProps){
        const { data_sources, zoom } = nextProps
        this.data_sources = data_sources
        this.zoom         = zoom
    }

    shouldComponentUpdate(nextProps, nextState){
    }

    componentWillUpdate(nextProps, nextState){
    }

    componentDidUpdate(prevProps, prevState){
    }

    render(){
        console.log("SpilbaGraphic::render()")
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
          </div>
        )
    }
}

export default SpilbaGraphic;
