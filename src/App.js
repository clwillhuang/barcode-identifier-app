import './App.css';
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import BlastDb from './pages/blastdb';
import Run from './pages/run';
import Blast from './pages/blast';

function App() {
  return (
    <div>
      <Navbar expand='md'>
        <Container>
          <NavbarCollapse id="basic-navbar-nav">
            <Nav className='me-auto'>
              <NavbarBrand>Barcode Identifier Web App</NavbarBrand>
              <NavItem>
                <NavLink as={Link} to='/'>Home</NavLink>
              </NavItem>
                <NavItem>
                  <NavLink as={Link} to='/credits'>Credits</NavLink>
                </NavItem>
            </Nav>
          </NavbarCollapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='database/:databaseId' element={<BlastDb/>}/>
        <Route path='run/:runId' element={<Run/>}/>
        <Route path='blast' element={<Blast/>}/>
      </Routes>
    </div>
  );
}

export default App;
