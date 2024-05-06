import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import BlastDb from './pages/blastdb';
import Run from './pages/run';
import Blast from './pages/blast';
import { QueryClient, QueryClientProvider } from 'react-query';
import RunStatus from './pages/run-status';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from './pages/not-found';
import Credits from './pages/credits';
import ApiDocs from './pages/api-docs';
import Libraries from './pages/libraries';
import Footer from './components/footer';
import Login from './pages/login';
import Logout from './pages/logout';
import Library from './pages/library';

const queryClient = new QueryClient()

function App() {

	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path='/' element={<Home/>}/>
					<Route path='libraries' element={<Libraries/>}/>
					<Route path='libraries/:libraryId' element={<Library/>}/>
					<Route path='libraries/:libraryId/version/:databaseId' element={<BlastDb/>}/>
					<Route path='run/:runId/status' element={<RunStatus/>}/>
					<Route path='run/:runId/results' element={<Run/>}/>
					<Route path='blast' element={<Blast/>}/>
					<Route path='credits' element={<Credits/>}/>
					<Route path='api-docs' element={<ApiDocs/>}/>
					<Route path='login' element={<Login/>}/>
					<Route path='logout' element={<Logout/>}/>
					<Route path='*' element={<NotFound/>}/>

				</Routes>
			</QueryClientProvider>
			<Footer/>
		</HelmetProvider>
	);
}

export default App;
