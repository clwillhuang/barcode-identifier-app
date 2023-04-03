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
import Manual from './pages/manual';
import ApiDocs from './pages/api-docs';
import Databases from './pages/databases';
import NavigationBar from './components/navigation';
import Footer from './components/footer';

const queryClient = new QueryClient()

function App() {

	return (
		<HelmetProvider>
			<NavigationBar/>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path='/' element={<Home/>}/>
					<Route path='database' element={<Databases/>}/>
					<Route path='database/:databaseId' element={<BlastDb/>}/>
					<Route path='run/:runId/status' element={<RunStatus/>}/>
					<Route path='run/:runId/results' element={<Run/>}/>
					<Route path='blast' element={<Blast/>}/>
					<Route path='credits' element={<Credits/>}/>
					<Route path='manual' element={<Manual/>}/>
					<Route path='api-docs' element={<ApiDocs/>}/>
					<Route path='*' element={<NotFound/>}/>
				</Routes>
			</QueryClientProvider>
			<Footer/>
		</HelmetProvider>
	);
}

export default App;
