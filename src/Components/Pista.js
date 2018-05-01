import React, { Component } from 'react'
import { v4 } from 'uuid'
import { connect } from 'react-redux'
import SpilbaPista from './../Components/SpilbaPista'
import head from 'lodash/head'


const PistaContainer = connect(
    state =>  ({
        grafico: head(state.graficos)
    })
    ,
    dispatch => ({
    })
)(SpilbaPista)

export default PistaContainer;
