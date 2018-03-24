import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'
import { min, max, extent } from 'd3-array'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select } from 'd3-selection'
import { brush } from 'd3-brush'
import { line } from 'd3-shape'
import { axisLeft, axisBottom } from 'd3-axis'
import { csvParse } from 'd3-dsv'

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

         this.height                    = height || 300;        
         this.width                     = width  || 960;       
         this.xOffset                   = 0.05*this.height;
         this.yOffset                   = 0.05*this.width; 
         this.data                      = this.data_sources.map( ds => csvParse(ds.raw_data) )
         this.lengthsOfSamplesFiles     = this.data.map( x => x.length );
         this.maxLengthOfSamplesFiles   = this.lengthsOfSamplesFiles.reduce( (x,acc) => x > acc ? x : acc );
         this.minsAndMaxsOfSamplesFiles = this.data.map( x => extent( x, d=>+d.velocity_kmh ) ).reduce((a,acc) => a.concat(acc) , []);
         this.shortestOfAll             = min(this.minsAndMaxsOfSamplesFiles,d=>d); 
         this.greatestOfAll             = max(this.minsAndMaxsOfSamplesFiles,d=>d);
         this.upFreeSpaceCoeff          = 0.1;
         this.maxOfDomain               = this.greatestOfAll *= ( 1 + this.upFreeSpaceCoeff ); 

         // Domains
         this.xInitialDomain            = [0, this.maxLengthOfSamplesFiles ] ;
         this.yInitialDomain            = [this.shortestOfAll,this.maxOfDomain];

         // Chart Scales
         this.xScale = scaleLinear().clamp(true).domain(this.xInitialDomain).range([this.xOffset,(this.width+this.xOffset)]);
         this.yScale = scaleLinear().clamp(true).domain(this.yInitialDomain).range([(this.height - this.yOffset),this.yOffset]);
         this.colors = scaleOrdinal(schemeCategory10);

         this.xAxis = axisBottom(this.xScale).ticks(12)
         this.yAxis = axisLeft(this.yScale).tickSize(-this.width)

         this.yAxisGroup  = null


         this.brush       = brush().on("end", this.brushended)
         this.idleTimeout = null
         this.idleDelay   = 350

        var xScale = this.xScale
        var yScale = this.yScale


        // Defining cursor data accesors 
        this.incomingDataLine = 
          line()
            .x((d,i) => { return this.xScale(i) } )
            .y( d    => { return this.yScale(d.velocity_kmh) } )

         // Bind this to createBarCharts and brushended
         this.createBarCharts           = this.createBarCharts.bind(this)
         this.brushended                = this.brushended.bind(this)

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

    brushended(){
    }

    createBarCharts(){
        const node             = this.node
        const incomingDataLine = this.incomingDataLine
        const colors           = this.colors
        const data_sources     = this.data_sources
        const data             = this.data

        select(node)
         .selectAll('path.line')
           .data(data)
             .enter()
             .append('path')
             .each(function(d,i){
               select(this)
                .attr('d',incomingDataLine(data[i]))
                .attr('fill','none')
                .attr('fill-opacity','0.5')
                .attr('stroke',colors(i))
                .attr('stroke-width','1')
                .attr('class','line');
            })


        select(node)
         .append("g")
         .attr("class", "axis axis--x")
         .attr("transform", "translate(0," + (this.height - this.yOffset) + ")")
         .call(this.xAxis)
    
        this.yAxisGroup = 
          select(node)
            .append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + this.xOffset + ",0)")
            .call(this.yAxis)
        
        // Horizontal Grid Lines ...
        this.yAxisGroup
          .selectAll('g.tick') 
          .each(function(){
            select(this)
              .selectAll('line')
              .attr('opacity','0.8')
              .attr('stroke','black')
              .attr('stroke-dasharray','1,8');
          })


    }

    render(){
        return (
          <div className="GraficoUI">
              <svg ref={ node => this.node = node } width={this.width + this.yOffset} height={this.height + this.xOffset}></svg>
          </div>
        )
    }
}



export default SpilbaGraphic;
