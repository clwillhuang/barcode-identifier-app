import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CustomHelmet from '../components/custom-helmet';
import Layout from '../components/layout';
import { appName } from '../url';
import styles from './home.module.css'
import Workflow from '../components/workflow';
import Wrapper from '../components/wrapper';

function Home() {

	let navigate = useNavigate();

	const helmet = <CustomHelmet
		title='Welcome'
		description={`The ${appName} allows users to query a curated library of Neotropical electric fish sequence barcodes with alignment tools.`}
		canonical=''
	/>

	return (
		<Wrapper>
			{helmet}
			<div className={styles.banner}>
				<img src='/app/homepage.jpg' alt='Rainforest aerial view' />
				<div className={styles.overlay}>
					<h1>DNA barcode libraries made simple.</h1>
					<p>Perform species identification using taxonomist-curated reference libraries from anywhere.</p>
					<div className={styles.buttonRow}>
						<Button onClick={() => navigate('/blast')}>Run a query</Button>
						<Button variant='secondary' href='#workflow'>Read more</Button>
					</div>
				</div>
			</div>
			<Layout>
				<Workflow/>
				<div className={styles.trust}>
					<div className={styles.content}>
						<h2>Access a database curated by expert taxonomists</h2>
						<p>Taxonomists can share reference libraries specific to their field of research, by collecting barcodes from specimens verified to be accurately identified and annotated.</p>
						<Link to='/libraries'>View reference libraries</Link>
					</div>
					<div className={styles.sideImage}>
						<img src='/app/database.png' alt='Screenshot of webpage for browsing sequence database' />
					</div>
				</div>
				<div className={styles.integration}>
					<div className={styles.content}>
						<h2>Run BLAST and multiple alignment with one click</h2>
						<p>Perform both BLAST and multiple sequence alignment with the same click, without having to visit multiple websites.</p>
					</div>
					<div className={styles.sideImage}>
						<img src='/app/blastn_results.png' alt='Screenshot of webpage for browsing blast results' />
					</div>
				</div>
				<div className={styles.user}>
					<div className={styles.content}>
						<h2>View and download results effortlessly</h2>
						<p>View the BLAST results and phylogenetic tree plots directly in the browser, and download the output files.</p>
					</div>
					<div className={styles.sideImage}>
						<img src='/app/tree_results.png' alt='Screenshot of webpage for browsing phylogenetic tree results'/>
					</div>
				</div>
				<div className={styles.user}>
					<div className={styles.content}>
						<h2>Query the database via API</h2>
						<p>Our computational tools make your libraries available to users via an application programming interface, allowing users to interact from the command line or a custom application.</p>
						<Link to='/api-docs'>Read our API documentation</Link>
					</div>
					<div className={styles.sideImage}>
						<img src='/app/api.png' alt='Screenshot of webpage for browsing api documentation'/>
					</div>
				</div>
				<div className={styles.ready}>
					<p>Ready to run a query?</p>
					<Button onClick={() => navigate('/blast')}>Submit a query.</Button>
					<Button href='/docs'>View the documentation.</Button>
				</div>
			</Layout>
		</Wrapper>
	);
}

export default Home;
