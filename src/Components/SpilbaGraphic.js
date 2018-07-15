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
import { drag } from 'd3-drag'
import isEqual from 'lodash/isEqual'
import './SpilbaGraphic.css'

class SpilbaGraphic extends Component{
    constructor(props){
        super(props)
        const { 
          id_, 
          channel_name, 
          zoom, 
          height,
          width,                    
          upFreeSpaceCoeff,          
          active_logs,
          onShiftCurve,
          onChangeZoomX } = props

         this.active_logs   = active_logs
         console.log("SpilbaGraphic::constructor()")

         this.data_sources  = active_logs
         this.zoom          = zoom
         this.id_channel    = id_
         this.onShiftCurve  = onShiftCurve
         this.onChangeZoomX = onChangeZoomX

         this.height                    = height || 300;        
         this.width                     = width  || 960;       
         this.xOffset                   = 0.05*this.width;
         this.yOffset                   = 0.05*this.height; 
         this.yRangeMin                 = 0.2*this.yOffset; 

         this.data                      = this.data_sources.map( ds => { 
		                            return { 
				              id_log:   ds._id,
				              columns:  ds.data.columns,
		                              raw_data: ds.data.rows,
					      channel_name_offset: ds.data.columns.indexOf(channel_name)
					    }
	                                  })


	 this.channel = this.data
		            .reduce((acc,d) => d.channel_name_offset,-1)

         this.minsAndMaxsOfSamplesFiles = this.data
		                              .map( x => extent( x.raw_data, d=>+d[x.channel_name_offset] ) )
		                              .reduce((a,acc) => a.concat(acc) , []);

         this.shortestOfAll            = min(this.minsAndMaxsOfSamplesFiles,d=>d); 
         this.greatestOfAll            = max(this.minsAndMaxsOfSamplesFiles,d=>d);
         this.upFreeSpaceCoeff         = 0.1;
         this.maxOfDomain              = this.greatestOfAll * ( 1 + this.upFreeSpaceCoeff ); 
         this.maxLengthOfSamplesFiles  = this.data
		                             .reduce( (acc,a) => a.raw_data.length > acc ? a.raw_data.length : acc, 0 )

         // Domains
	 this.xInitialDomain            = [0, this.maxLengthOfSamplesFiles] ;
         this.yInitialDomain            = [this.shortestOfAll,this.maxOfDomain];

         // Chart Scales
         this.xScale = scaleLinear().clamp(true).domain(this.xInitialDomain).range([this.xOffset,(this.width+this.xOffset)]);
         this.yScale = scaleLinear().clamp(true).domain(this.yInitialDomain).range([(this.height - this.yOffset),this.yRangeMin]);
         this.colors = scaleOrdinal(schemeCategory10);

         this.xAxis = axisBottom(this.xScale).ticks(12)
         this.yAxis = axisLeft(this.yScale).tickSize(-this.width)

         this.yAxisGroup  = null

        // Defining cursor data accesors 
        this.incomingDataLine = line()
            .x((d,i) => { return this.xScale(i) } )
            .y( d    => { return this.yScale(parseFloat(d[this.channel])) } )

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
        const id_channel  = this.id_channel
        const active_logs = this.active_logs
        const wasShifted  = !isEqual(active_logs.map( acl => acl.x_offset ), nextProps.active_logs.map( acl => acl.x_offset ))

        return ( id_channel !== nextProps.id_channel || wasShifted )
    }

    componentDidUpdate(){
        console.log("SpilbaGraphic::componentDidUpdate()")
        this.createBarCharts()
    }

    componentWillReceiveProps(nextProps){
        console.log("SpilbaGraphic::componentWillReceiveProps()")
	console.log(nextProps)
        const { data_sources,  zoom } = nextProps
        this.data_sources = data_sources
        this.xScale.domain(zoom.zoom_x)
    }

    componentWillUpdate(nextProps, nextState){
        console.log("SpilbaGraphic::componentWillUpdate()")
        const { active_logs } = nextProps
        this.active_logs = active_logs
    }

    // Continuar desde aca para generar el zoom en el grafico
    createBarCharts(){
        console.log("SpilbaGraphic::createBarCharts()")
        const node             = this.node
        let incomingDataLine   = this.incomingDataLine
        const colors           = this.colors
        const data_sources     = this.data_sources
        const offsets          = this.active_logs.map( acl => acl.x_offset )
        const data             = this.data
	const channel          = this.channel 
		                
        let   idleTimeout    = null
        const idleDelay      = 350

        const xScale         = this.xScale
        const yScale         = this.yScale
        const xInitialDomain = this.xInitialDomain
        const yInitialDomain = this.yInitialDomain
        const xOffset        = this.xOffset
        const yOffset        = this.yOffset
        const width          = this.width
        const height         = this.height
        const onChangeZoomX  = this.onChangeZoomX 
        const onShiftCurve   = this.onShiftCurve 
        const id_channel     = this.id_channel
        const maxLengthOfSamplesFiles = this.maxLengthOfSamplesFiles
        const yRangeMin      = this.yRangeMin
        const brush          = this.brush()
                                 .on("end", brushended)

        const dragBehavior   = drag()
                                 .on("start",dragstarted)
                                 .on("drag",dragging)
                                 .on("end",dragend)

        select(node)
         .html("");

        select(node)
         .selectAll('path.line')
           .data(data)
             .enter()
             .append('path')
             .each(function(d,i){

               incomingDataLine = line()
                .x((dat,j) => { return xScale(j + offsets[i] ) } )
                .y( dat    => { return yScale(parseFloat(dat[channel])) } )

               select(this)
                .attr('d',incomingDataLine(d.raw_data))
                .attr('fill','none')
                .attr('fill-opacity','0.5')
                .attr('stroke',colors(i))
                .attr('stroke-width','3')
                .attr('id',() => `curva_${i}`)
                .attr('class','line')
                //.call(dragBehavior);
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
                select(this).attr('d',incomingDataLine(data[i].raw_data)) // modificar esto...
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

        let initialDragDomainValue = 0
        let initialDragRangeValue  = 0
        let finalDragDomainValue   = 0
        let finalDragRangeValue    = 0
        function dragstarted(){
            select(this).raise()
            select(this).style('cursor','w-resize')
            var dx = event.sourceEvent.offsetX,
                dy = event.sourceEvent.offsetY

            initialDragDomainValue  = xScale.invert(dx)
            initialDragRangeValue   = yScale.invert(dy)

            console.log("draggedSTART()--")
            console.log(dx + " inverted... " + initialDragDomainValue)
            console.log(dy + " inverted... " + initialDragRangeValue)
        }


        function dragging(){
            select(this).style('cursor','w-resize')

            var dx = event.sourceEvent.offsetX,
                dy = event.sourceEvent.offsetY

            finalDragDomainValue  = xScale.invert(dx)
            finalDragRangeValue   = yScale.invert(dy)
            const x_offset = Math.floor(finalDragDomainValue - initialDragDomainValue);

            incomingDataLine = line()
              .x((dat,j) => { return xScale(j + x_offset) } )
              .y( dat    => { return yScale(parseFloat(dat[channel])) } )
            
            select(this)
                .attr('stroke-dasharray','10,5')
                .attr('d', (d) => incomingDataLine(d.raw_data) )
        }

        function dragend(){
            var dx = event.sourceEvent.offsetX,
                dy = event.sourceEvent.offsetY

            finalDragDomainValue  = xScale.invert(dx)
            finalDragRangeValue   = yScale.invert(dy)

            const x_offset = Math.floor(finalDragDomainValue - initialDragDomainValue);
            
            var id_log = select(this).datum().id_log            
            select(this)
                .attr('stroke-dasharray','1,0')
            onShiftCurve(id_channel,id_log,x_offset)
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
