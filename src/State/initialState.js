/* eslint_disable */
import { v4 } from 'uuid'
const id_05 = v4()
const id_06 = v4()
const id_07 = v4()

var initialState = {
    active_logs: [
    ],
    in_session_logs: [
    ],
    channels: [
        {
          id_: id_07,
          channel_name: 'Lat. accel',
          channel_function: x => x
        },
        {
          id_: id_05,
          channel_name: 'velocity kmh',
          channel_function: x => x
        },    
        {
          id_: id_06,
          channel_name: 'Long. accel',
          channel_function: x => x
        }
    ],
    active_channels: [
        {
          id_: id_07,
          zoom: { }
        },
        {
          id_: id_05,
          zoom: { }
        },
        {
          id_: id_06,
          zoom: { }
        }
    ]
}

export default initialState;
