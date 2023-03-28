import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CustomHelmet from '../components/custom-helmet';
import Wrapper from '../components/wrapper';
import { appName } from '../url';
import styles from './home.module.css'
import Workflow from '../components/workflow';

function Home() {

	let navigate = useNavigate();
	const exampleLink = '/run/1d86710c-dd8e-4906-bef1-20c533916848/results';

	const helmet = <CustomHelmet
		title='Welcome'
		description={`The ${appName} allows users to query a curated library of Neotropical electric fish sequence barcodes with alignment tools.`}
		canonical=''
	/>

	return (
		<div>
			{helmet}
			<div className={styles.banner}>
				<img src='./homepage.jpg' />
				<div className={styles.overlay}>
					<h1>DNA barcode libraries made simple.</h1>
					<p>Perform species identification using taxonomist-curated reference libraries from anywhere.</p>
					<div className={styles.buttonRow}>
						<Button onClick={() => navigate('/blast')}>Run a query</Button>
						<Button variant='secondary' href='#workflow'>Read more</Button>
					</div>
				</div>
			</div>
			<Wrapper>
				<Workflow/>
				<div className={styles.trust}>
					<div className={styles.content}>
						<h2>Access a database curated by expert taxonomists</h2>
						<p>Taxonomists can share reference libraries specific to their field of research, by collecting barcodes from specimens verified to be accurately identified and annotated.</p>
						<Link to='/databases'>Browse databases</Link>
					</div>
					<div className={styles.sideImage}>
						<img src='./database.png' />
					</div>
				</div>
				<div className={styles.integration}>
					<div className={styles.content}>
						<h2>Run BLAST and multiple alignment with one click</h2>
						<p>Perform both BLAST and multiple sequence alignment with the same click, without having to visit multiple websites.</p>
						<Link to={exampleLink}>View an example</Link>
					</div>
					<div className={styles.sideImage}>
						<img src='./blastn_results.png' />
					</div>
				</div>
				<div className={styles.user}>
					<div className={styles.content}>
						<h2>View and download results effortlessly</h2>
						<p>View the BLAST results and phylogenetic tree plots directly in the browser, and download the output files.</p>
						<Link to={exampleLink}>View an example</Link>
					</div>
					<div className={styles.sideImage}>
						<img src='./tree_results.png' />
					</div>
				</div>
				<div className={styles.user}>
					<div className={styles.content}>
						<h2>Query the database via API</h2>
						<p>Our computational tools make your libraries available to users via an application programming interface, allowing users to interact from the command line or a custom application.</p>
						<Link to='/api-docs'>Read our API documentation</Link>
					</div>
					<div className={styles.sideImage}>
						<img src='./api.png' />
					</div>
				</div>
				<div className={styles.ready}>
					<p>Ready to run a query?</p>
					<Button onClick={() => navigate('/blast')}>Submit a query.</Button>
					<Button onClick={() => navigate('/manual')}>View the user manual.</Button>
				</div>
			</Wrapper>
		</div>
	);
}

export default Home;
