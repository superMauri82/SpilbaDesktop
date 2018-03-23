import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'
import { min, max, extent } from 'd3-array'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select } from 'd3-selection'

class SpilbaGraphic extends Component{
    constructor(props){
        super(props)
        const { 
          id, 
          data_sources, 
          zoom, 
          height,
          width,                    
          upFreeSpaceCoeff,          
          onChangeZoomX } = props

         this.data_sources  = data_sources
         this.zoom          = zoom
         this.id            = id
         this.onChangeZoomX = onChangeZoomX

         this.height                    = height || 600;        
         this.width                     = width  || 960;       
         this.xOffset                   = 0.05*height;
         this.yOffset                   = 0.05*width; 
         this.lengthsOfSamplesFiles     = this.data_sources.map( x => x.length );
         this.maxLengthOfSamplesFiles   = this.lengthsOfSamplesFiles.reduce( (x,acc) => x > acc ? x : acc );
         this.minsAndMaxsOfSamplesFiles = this.data_sources.map( x => extent( x, d=>+d.velocity_kmh ) ).reduce((a,acc) => a.concat(acc) , []);
         this.shortestOfAll             = min(this.minsAndMaxsOfSamplesFiles,d=>d); 
         this.greatestOfAll             = max(this.minsAndMaxsOfSamplesFiles,d=>d);
         this.upFreeSpaceCoeff          = 0.1;
         this.maxOfDomain               = this.greatestOfAll *= ( 1 + this.upFreeSpaceCoeff ); 

         // Domains
         this.xInitialDomain            = [0, this.maxLengthOfSamplesFiles ] ;
         this.yInitialDomain            = [this.shortestOfAll,this.maxOfDomain];
         this.colors                    = ['green','grey','blue','black','red','orange','light-blue','pink'];

         // Chart Scales
         this.xScale = scaleLinear().clamp(true).domain(this.xInitialDomain).range([this.xOffset,(this.width+this.xOffset)]);
         this.yScale = scaleLinear().clamp(true).domain(this.yInitialDomain).range([(this.height - this.yOffset),this.yOffset]);
         this.colors = scaleOrdinal(schemeCategory10);

         // Bind this to createBarCharts
         this.createBarCharts           = this.createBarCharts.bind(this)

    }

    componentDidMount(){
        this.createBarCharts()
    }

    componentDidUpdate(){
        this.createBarCharts()
    }

    componentWillReceiveProps(nextProps){
        const { data_sources, zoom } = nextProps
        this.data_sources = data_sources
        this.zoom         = zoom
    }

    componentWillUpdate(nextProps, nextState){
    }

    createBarCharts(){
        const node = this.node
        var datos  = [1,32,44]
        select(node)
          .selectAll('circle')
          .data(datos)
          .enter()
          .append('circle')
          .attr('r', () => Math.floor(Math.random()*150) )
          .attr('cx', (d,i) => i*200 )
          .attr('cy', 200)
          .attr('fill', () => this.colors( Math.ceil(Math.random()*10)) )
    }

    render(){
        return (
          <div className="GraficoUI">
              <svg ref={ node => this.node = node } width={this.height} height={this.width}></svg>
          </div>
        )
    }
}



export default SpilbaGraphic;
