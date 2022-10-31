import { ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import BlastDbPreview from '../components/blastdb-preview';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

function Home() {

	const { isLoading, error, data } = useQuery(['home_databases'], () =>
		fetch(`${urlRoot}/blastdbs/`)
			.then((response) => response.json())
	)

	if (isLoading) return (
		<Wrapper>
			<div>
				<p>Retrieving data ...</p>
			</div>
		</Wrapper>
	)

	if (error) return (
		<Wrapper>
			<div>
				<b>Encountered an error fetching databases. Please try again.</b>
			</div>
		</Wrapper>
	)

	return (
		<Wrapper>
			<div>
				<h2>Databases available</h2>
				<p>Found {data.length} blast database(s) to run.</p>
			</div>
			<ListGroup>
				{data.map(db => <BlastDbPreview database={db} key={db.id}></BlastDbPreview>)}
			</ListGroup>
		</Wrapper>
	);
}

export default Home;
