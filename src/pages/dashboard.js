import React from 'react';
import Layout from '../Components/Layout.js'
import GrafContainer from '../Components/Graficos'
import initialState from '../State/initialState'
import storeFactory from '../Stores/StoreFactory'

const store = storeFactory()

export default () => (
    <Layout>
        <div className="wrapper">
            <div className="container">
                <hr/>
                <GrafContainer store={store} />,
                <hr/>
            </div>
        </div>
    </Layout>
)
