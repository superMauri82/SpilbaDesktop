import React from 'react';
import Layout from '../Components/Layout.js'
import PistaContainer from '../Components/Pista'
import initialState from '../State/initialState'
import storeFactory from '../Stores/StoreFactory'

const store = storeFactory()

const PistaPage = () => (
    <Layout>
        <div className="wrapper">
            <div className="container">
                <hr/>
                <PistaContainer store={store} />,
                <hr/>
            </div>
        </div>
    </Layout>
)

export default PistaPage;
