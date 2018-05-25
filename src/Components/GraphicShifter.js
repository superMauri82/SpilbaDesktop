import React, { Component } from 'react'
import './GraphicShifter.css'
import 'react-tippy/dist/tippy.css'
import { Tooltip } from 'react-tippy'

const GraphicShifter = 
    ({colors}) => 
    {
      const initialOffset = 50
      const radius        = 10
      return(
          <div className="graphicShifter">
          { 
            colors.map(  
              (d,i) =>  
                <Tooltip key={i} arrow={true} title={ d.name_log } position="top" offset="80" distance="0" >
                  <div style={{backgroundColor: `${d.color}`}}>
                  </div>
                </Tooltip>
            )
          }
          </div>
      )
    }

export default GraphicShifter; 
