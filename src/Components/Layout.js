import React from "react";
import { Container } from 'reactstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = (props) => {
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar {...props}/>
        <main className="main">
          <Container fluid>
            {props.children}
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
