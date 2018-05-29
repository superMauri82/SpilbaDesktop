/* eslint_disable */
import { v4 } from 'uuid'

var id_01 = v4()
var id_02 = v4()
var id_03 = v4()
var id_04 = v4()
var id_05 = v4()
var id_06 = v4()
var id_07 = v4()
var id_08 = v4()
var id_09 = v4()

var initialState = {
    active_logs: [
        {
          id_log: id_01,
          name_log: 'Pista 1',
          color: 'green',
          x_offset: 0
        },
        {
          id_log: id_02,
          name_log: 'Pista 2',
          color: 'blue',
          x_offset: 0
        },
        {
          id_log: id_03,
          name_log: 'Pista 3',
          color: 'red',
          x_offset: 0
        },
        {
          id_log: id_04,
          name_log: 'Pista 4',
          color: 'orange',
          x_offset: 0
        }
    ],
    in_session_logs: [
        {
          id_log: id_01,
          name_log: 'Pista 1',
          raw_data: `sats,time,lat,long,velocity_kmh
20,121349.40,_2098.8985,3490.4624,63.46
20,121349.50,_2098.9002,3490.4622,41.03
20,121349.60,_2098.9019,3490.4630,46.6
20,121349.70,_2098.9036,3490.4639,44.17
20,121349.80,_2098.9053,3490.4647,63.74
20,121350.40,_2098.6418,3491.1947,21.051`
        },
        {
          id_log: id_02,
          name_log: 'Pista 2',
          raw_data: `sats,time,lat,long,velocity_kmh
20,121349.40,_2098.8985,3490.4624,137.46
20,121349.50,_2098.9002,3490.4622,741.03
20,121349.60,_2098.9019,3490.4630,746.6
20,121349.70,_2098.9036,3490.4639,654.17
20,121349.80,_2098.9053,3490.4647,363.74
20,121350.40,_2098.6418,3491.1947,221.051`
        },
        {
          id_log: id_03,
          name_log: 'Pista 3',
          raw_data: `sats,time,lat,long,velocity_kmh
20,121349.40,_2098.8985,3490.4624,67.46
20,121349.50,_2098.9002,3490.4622,21.03
20,121349.60,_2098.9019,3490.4630,12.6
20,121349.70,_2098.9036,3490.4639,12.17
20,121349.80,_2098.9053,3490.4647,73.74
20,121350.40,_2098.6418,3491.1947,21.051`
        },
        {
          id_log: id_04,
          name_log: 'Pista 4',
          raw_data: `sats,time,lat,long,velocity_kmh
20,121349.40,_2098.8985,3490.4624,637.46
20,121349.50,_2098.9002,3490.4622,21.03
20,121349.60,_2098.9019,3490.4630,86.6
20,121349.70,_2098.9036,3490.4639,45.17
20,121349.80,_2098.9053,3490.4647,06.74
20,121350.40,_2098.6418,3491.1947,22.051`
        }
    ],
    channels: [
        {
          id_channel: id_05,
          channel_name: 'sats',
          channel_function: x => x
        },
        {
          id_channel: id_06,
          channel_name: 'time',
          channel_function: x => x
        },
        {
          id_channel: id_07,
          channel_name: 'lat',
          channel_function: x => x
        },
        {
          id_channel: id_08,
          channel_name: 'log',
          channel_function: x => x
        },
        {
          id_channel: id_09,
          channel_name: 'velocity_kmh',
          channel_function: x => x
        }
    ],
    active_channels: [
        {
          id_channel: id_05,
          zoom: { zoom_x : [ 10, 20 ] , zoom_y : [ 100, 200 ] }
        },
        {
          id_channel: id_09,
          zoom: { zoom_x : [ 10, 20 ] , zoom_y : [ 100, 200 ] }
        },
        {
          id_channel: id_08,
          zoom: { zoom_x : [ 10, 20 ] , zoom_y : [ 100, 200 ] }
        }
    ]
}

export default initialState;
