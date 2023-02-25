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
import { HelmetProvider } from 'react-helmet-async';
import NotFound from './pages/not-found';
import Credits from './pages/credits';
import { appName } from './url';
import Manual from './pages/manual';

const queryClient = new QueryClient()

function App() {
	return (
		<HelmetProvider>
			<Navbar bg='dark' variant='dark' expand='sm'>
				<Container>
					<NavbarBrand>{appName}</NavbarBrand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<NavbarCollapse id="basic-navbar-nav">
						<Nav className='me-auto'>
							<NavItem>
								<NavLink as={Link} to='/'>Home</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/blast'>Run</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/manual'>Manual</NavLink>
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
					<Route path='/' element={<Home />} />
					<Route path='database/:databaseId' element={<BlastDb />} />
					<Route path='run/:runId/status' element={<RunStatus />} />
					<Route path='run/:runId/results' element={<Run />} />
					<Route path='blast' element={<Blast />} />
					<Route path='credits' element={<Credits />} />
					<Route path='manual' element={<Manual/>} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
