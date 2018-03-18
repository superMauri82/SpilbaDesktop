/* eslint-disable */
import { graficos } from './../Reducers/reducers'
import { 
         addGraphic,
         removeGraphic,
         changeXzoomExtent,
         changeYzoomExtent,
         toggleDataSourceVisibility 
} from './../Actions/actions'

         
var initialState = {
    graficos: [
        { 
          id: 1, 
          data_sources: [
              { 
                  id: 1,
                  log: 'pista_mojada_La_Plata_01.spb',
                  y_axis: 'vel',
                  x_axis: 'time',
                  visible: true
              },
              { 
                  id: 2,
                  log: 'pista_seca_La_Plata_02.spb',
                  y_axis: 'vel',
                  x_axis: 'time',
                  visible: true
              },
              { 
                  id: 3,
                  log: 'curvon_La_Plata_04.spb',
                  y_axis: 'vel',
                  x_axis: 'time',
                  visible: true
              }
          ], 
          zoom: { zoom_x : [ 10, 20 ] , zoom_y : [ 100, 200 ] } 
        },
        { 
          id: 2, 
          data_sources: [
              { 
                  id: 1,
                  log: 'pista_mojada_La_Plata_01.spb',
                  y_axis: 'acel',
                  x_axis: 'time',
                  visible: false
              },
              { 
                  id: 2,
                  log: 'pista_seca_La_Plata_02.spb',
                  y_axis: 'acel',
                  x_axis: 'time',
                  visible: true
              },
              { 
                  id: 3,
                  log: 'curvon_La_Plata_04.spb',
                  y_axis: 'vel',
                  x_axis: 'time',
                  visible: true
              }
          ], 
          zoom: { zoom_x : [ 1005, 2050 ] , zoom_y : [ 100, 200 ] } 
        }
    ]
}
    
export default initialState;
