import './App.css';
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import BlastDb from './pages/blastdb';
import Run from './pages/run';
import Blast from './pages/blast';
import { QueryClient, QueryClientProvider } from 'react-query';
import RunStatus from './pages/run-status';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient()

function App() {
	return (
		<HelmetProvider>
			{/* TODO: Remove noindex on production, and uninstall react-helmet-async if no longer required */}
			<Helmet>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			<Navbar bg='dark' variant='dark' expand='md'>
				<Container>
					<NavbarCollapse id="basic-navbar-nav">
						<Nav className='me-auto'>
							<NavbarBrand>Barcode Identifier Web App</NavbarBrand>
							<NavItem>
								<NavLink as={Link} to='/'>Home</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/blast'>Run</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/credits'>Credits</NavLink>
							</NavItem>
						</Nav>
					</NavbarCollapse>
				</Container>
			</Navbar>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path='/' element={<Home/>} />
					<Route path='database/:databaseId' element={<BlastDb/>} />
					<Route path='run/:runId/status' element={<RunStatus/>}/>
					<Route path='run/:runId/results' element={<Run/>} />
					<Route path='blast' element={<Blast/>} />
				</Routes>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
