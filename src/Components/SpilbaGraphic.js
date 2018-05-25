import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeXzoomExtent } from './../Actions/actions'
import { min, max, extent } from 'd3-array'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select, event } from 'd3-selection'
import { brush } from 'd3-brush'
import { line } from 'd3-shape'
import { axisLeft, axisBottom } from 'd3-axis'
import { csvParse } from 'd3-dsv'

class SpilbaGraphic extends Component{
    constructor(props){
        super(props)
        console.log("SpilbaGraphic")
        console.log(props)
        const { 
          id_channel, 
          zoom, 
          height,
          width,                    
          upFreeSpaceCoeff,          
          active_logs,
          onChangeZoomX } = props

         //this.data_sources  = data_sources
         this.data_sources  = active_logs
         this.zoom          = zoom
         this.id_channel    = id_channel
         this.onChangeZoomX = onChangeZoomX

         this.height                    = height || 300;        
         this.width                     = width  || 960;       
         this.xOffset                   = 0.05*this.width;
         this.yOffset                   = 0.05*this.height; 
         this.yRangeMin                 = 0.2*this.yOffset; 
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
         this.yScale = scaleLinear().clamp(true).domain(this.yInitialDomain).range([(this.height - this.yOffset),this.yRangeMin]);
         this.colors = scaleOrdinal(schemeCategory10);

         this.xAxis = axisBottom(this.xScale).ticks(12)
         this.yAxis = axisLeft(this.yScale).tickSize(-this.width)

         this.yAxisGroup  = null


        // Defining cursor data accesors 
        this.incomingDataLine = 
          line()
            .x((d,i) => { return this.xScale(i) } )
            .y( d    => { return this.yScale(d.velocity_kmh) } )

         // Bind this to createBarCharts
         this.createBarCharts           = this.createBarCharts.bind(this)
         this.brush                     = brush

    }

    componentDidMount(){
        console.log("SpilbaGraphic::componentDidMount()")
        this.createBarCharts()
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log("SpilbaGraphic::shouldComponentUpdate()")
        const id_channel = this.id_channel
        return id_channel !== nextProps.id_channel
    }

    componentDidUpdate(){
        console.log("SpilbaGraphic::componentDidUpdate()")
        this.createBarCharts()
    }

    componentWillReceiveProps(nextProps){
        console.log("SpilbaGraphic::componentWillReceiveProps()")
        const { data_sources, zoom } = nextProps
        this.data_sources = data_sources
        this.xScale.domain(zoom.zoom_x)
    }

    componentWillUpdate(nextProps, nextState){
        console.log("SpilbaGraphic::componentWillUpdate()")
    }

    // Continuar desde aca para generar el zoom en el grafico
    createBarCharts(){
        const node             = this.node
        const incomingDataLine = this.incomingDataLine
        const colors           = this.colors
        const data_sources     = this.data_sources
        const data             = this.data

        const brush            = this.brush().on("end", brushended)
        let   idleTimeout      = null
        const idleDelay        = 350

        const xScale         = this.xScale
        const yScale         = this.yScale
        const xInitialDomain = this.xInitialDomain
        const yInitialDomain = this.yInitialDomain
        const xOffset        = this.xOffset
        const yOffset        = this.yOffset
        const width          = this.width
        const height         = this.height
        const onChangeZoomX  = this.onChangeZoomX 
        const id_channel     = this.id_channel
        const maxLengthOfSamplesFiles = this.maxLengthOfSamplesFiles
        const yRangeMin      = this.yRangeMin

        select(node)
         .html("");

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
            .attr("transform", "translate(" + (xOffset) + ",0)")
            .call(this.yAxis)
        
        // Horizontal Grid Lines ...
        this.yAxisGroup
          .selectAll('g.tick') 
          .each(function(){
            select(this)
              .selectAll('line')
              .attr('opacity','0.8')
              .attr('stroke','black')
              .attr('stroke-dasharray','1,8')
          })

        // Setting the domain bolder
        select(node)
          .append("line")
          .attr('stroke','black')
          .attr('stroke-width','1')
          .attr('x1', xScale(maxLengthOfSamplesFiles))
          .attr('y1',(yRangeMin))
          .attr('x2', xScale(maxLengthOfSamplesFiles))
          .attr('y2',(height - yOffset));
      
        select(node)
          .append("g")
          .attr("class", "brush")
          .call(brush)

        function brushended(){
            var s = event.selection;
            var x_new_values = []
            var y_new_values = []

            if (!s) {
              if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay)
              x_new_values = xInitialDomain
              xScale.domain(xInitialDomain)
              yScale.domain(yInitialDomain)
            } else {
              x_new_values = [s[0][0], s[1][0]].map(xScale.invert, xScale)
              xScale.domain(x_new_values)
              y_new_values = [s[1][1], s[0][1]].map(yScale.invert, yScale)
              yScale.domain(y_new_values)
              select(node).select(".brush").call(brush.move, null)
            }
            zoom()
            onChangeZoomX(id_channel,x_new_values)

        }

        const yAxisGroup = this.yAxisGroup
        const xAxis      = this.xAxis
        const yAxis      = this.yAxis
        function zoom() {
          var t = select(node).transition().duration(1000);
          select(node) .select(".axis--x").transition(t).call(xAxis);
          select(node).select(".axis--y").transition(t).call(yAxis);
          select(node).selectAll('path.line')
             .transition(t)
             .each(function(d,i){
                select(this).attr('d',incomingDataLine(data[i]))
            });
        
          yAxisGroup
            .selectAll('g.tick') 
            .transition(t)
            .each(function(){
              select(this)
                .selectAll('line')
                .attr('opacity','0.8')
                .attr('stroke','black')
                .attr('stroke-dasharray','1,8');
            });
        }

        function idled() {
          idleTimeout = null;
        }


    }

    render(){

        return (
          <div className="GraficoUI">
              <svg ref={ node => this.node = node } width={this.width + this.xOffset} height={this.height + this.yOffset}></svg>
          </div>
        )
    }
}



export default SpilbaGraphic;
