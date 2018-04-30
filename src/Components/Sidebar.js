import React, {Component} from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <Nav>
            
            <NavItem>
              <NavLink to='/' exact className='nav-link' activeClassName="active">
                <i className='icon-home' /> Home
              </NavLink>
            </NavItem>
  
            <NavItem>
              <NavLink to='/sessions'  className='nav-link' activeClassName="active">
                <i className='icon-screen-tablet' />Sessions
              </NavLink>
            </NavItem>
            
            <NavItem>
              <NavLink to='/dashboard' className='nav-link' activeClassName="active">
                <i className='icon-speedometer' />Dashboard
              </NavLink>
            </NavItem>
  
            <NavItem>
              <NavLink to='/logs' className='nav-link' activeClassName="active">
                <i className='icon-home' /> Logs
              </NavLink>
            </NavItem>
            
            <NavItem>
              <NavLink to='/tracks' className='nav-link' activeClassName="active">
                <i className='icon-home' /> Tracks
              </NavLink>
            </NavItem>
            
          </Nav>
        </nav>
      </div>
    )
  }
}

export default withRouter(Sidebar);