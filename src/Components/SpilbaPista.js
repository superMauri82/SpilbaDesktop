import React, { Component } from 'react'
import { min, max, extent } from 'd3-array'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select, event } from 'd3-selection'
import { brush } from 'd3-brush'
import { line } from 'd3-shape'
import { axisLeft, axisBottom } from 'd3-axis'
import { csvParse } from 'd3-dsv'
import head from 'lodash/head'

class SpilbaPista extends Component{
    constructor(props){ 
        super(props)
        const { grafico } = props
        const { 
          id, 
          data_sources, 
          zoom, 
          height,
          width                    
        } = grafico

         this.data_sources  = data_sources
         this.zoom          = zoom
         this.id            = id

         this.height                    = height || 400;        
         this.width                     = width  || 400;       
         this.xOffset                   = 0.10*this.width;
         this.yOffset                   = 0.05*this.height; 
         this.yRangeMin                 = 0.2*this.yOffset; 
         this.data                      = [head(this.data_sources)].map( ds => csvParse(ds.raw_data) )
         this.minsAndMaxsOfLatitudes    = this.data.map( x => extent( x, d=>+d.lat ) ).reduce((a,acc) => a.concat(acc) , []);
         this.minsAndMaxsOfLongitudes   = this.data.map( x => extent( x, d=>+d.long ) ).reduce((a,acc) => a.concat(acc) , []);
         this.minOfLatitudes            = min(this.minsAndMaxsOfLatitudes,d=>d); 
         this.maxOfLatitudes            = max(this.minsAndMaxsOfLatitudes,d=>d); 
         this.minOfLongitudes           = min(this.minsAndMaxsOfLongitudes,d=>d); 
         this.maxOfLongitudes           = max(this.minsAndMaxsOfLongitudes,d=>d);

         // Domains
         this.xInitialDomain            = [this.minOfLatitudes,this.maxOfLatitudes] ;
         this.yInitialDomain            = [this.minOfLongitudes,this.maxOfLongitudes] ;

         // Chart Scales
         this.xScale = scaleLinear().clamp(true).domain(this.xInitialDomain).range([this.xOffset,(this.width+this.xOffset)]);
         this.yScale = scaleLinear().clamp(true).domain(this.yInitialDomain).range([(this.height - this.yOffset),this.yRangeMin]);
         this.colors = scaleOrdinal(schemeCategory10);

         this.xAxis = axisBottom(this.xScale).ticks(12).tickSize(-this.height)
         this.yAxis = axisLeft(this.yScale).tickSize(-this.width)

         this.xAxisGroup  = null
         this.yAxisGroup  = null


        // Defining cursor data accesors 
        this.incomingDataLine = 
          line()
            .x((d,i) => { return this.xScale(d.lat) } )
            .y( d    => { return this.yScale(d.long) } )

         // Bind this to createBarCharts
         this.createBarCharts           = this.createBarCharts.bind(this)
         this.brush                     = brush

    }

    componentDidMount(){
        console.log("SpilbaPista::componentDidMount()")
        this.createBarCharts()
    }

    shouldComponentUpdate(nextProps, nextState){
        console.log("SpilbaPista::shouldComponentUpdate()")
        const id = this.id
        return id !== nextProps.id
    }

    componentDidUpdate(){
        console.log("SpilbaPista::componentDidUpdate()")
        this.createBarCharts()
    }

    componentWillReceiveProps(nextProps){
        console.log("SpilbaPista::componentWillReceiveProps()")
        const { data_sources, zoom } = nextProps
        this.data_sources = data_sources
        this.xScale.domain(zoom.zoom_x)
    }

    componentWillUpdate(nextProps, nextState){
        console.log("SpilbaPista::componentWillUpdate()")
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
        const id             = this.id
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

        this.xAxisGroup =
          select(node)
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + (this.height - this.yOffset) + ")")
            .call(this.xAxis)

        // Vertical Grid Lines ...
        this.xAxisGroup
          .selectAll('g.tick') 
          .each(function(){
            select(this)
              .selectAll('line')
              .attr('opacity','0.8')
              .attr('stroke','black')
              .attr('stroke-dasharray','1,8')
          })

    
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
        }

        const xAxisGroup = this.xAxisGroup
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
        
          xAxisGroup
            .selectAll('g.tick') 
            .transition(t)
            .each(function(){
              select(this)
                .selectAll('line')
                .attr('opacity','0.8')
                .attr('stroke','black')
                .attr('stroke-dasharray','1,8');
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



export default SpilbaPista;
