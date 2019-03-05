
const Logs = [
    {
        id: 1234567,
        source: 'spilba v1',
        created_at: Date.now().toLocaleString(),
        tags:['example','log'],
        data: {
            key: 0,
            units: ['ms','km/h','°C'],
            columns: ['position','speed','temperature'],
            rows:[
                [100,80,27],
                [200,81,27],
                [300,82,27],
                [400,83,28],
                [500,84,28],
                [600,85,28],
                [700,86,29],
                [900,87,29],
                [900,88,29],
                [1000,89,29]
            ]
        }
    },
    {
        id: 1234568,
        source: 'spilba v1',
        created_at: Date.now().toLocaleString(),
        tags:['example 2','another log'],
        data: {
            key: 0,
            units: ['ms','km/h','°C'],
            columns: ['position','speed','temperature'],
            rows:[
                [100,180,127],
                [200,181,127],
                [300,182,127],
                [400,183,128],
                [500,184,128],
                [600,185,128],
                [700,186,129],
                [900,187,129],
                [900,188,129],
                [1000,89,129]
            ]
        }
    }

];

const Tracks = [
    {
        id:13579,
        log: 1234567,
        main: true,
        start: 0,
        end: 9,
        tags: ['prueba','datos demo'],
    },
    {
        id:13580,
        log: 1234567,
        main: false,
        start: 0,
        end: 4,
        tags: ['seccion 1','datos demo'],
    },
    {
        id:13581,
        log: 1234567,
        main: false,
        start: 5,
        end: 9,
        tags: ['seccion 2','datos demo'],
    },
    {
        id: 13582,
        log: 1234568,
        main: true,
        start: 7,
        end: 9,
        tags: ['datos demo','prueba 2']
    },
    {
        id: 13583,
        log: 1234568,
        main: false,
        start: 0,
        end: 4,
        tags: ['sección 1','datos demo','seccion impar']
    },
    {
        id: 13584,
        log: 1234568,
        main: false,
        start: 5,
        end: 9,
        tags: ['sección 2','datos demo','seccion impar']
    },
];


const State = {
    logs : Logs,
    tracks: Tracks,
};

export {
    Logs,
    Tracks,
    State
};
