import { ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import BlastDbPreview from '../components/blastdb-preview';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

function Home() {

	const { isLoading, error, data, isError } = useQuery(['home_databases'], () =>
		fetch(`${urlRoot}/blastdbs/`)
			.then(handleResponse()),
		{
			refetchInterval: false,
			retry: false,
		}
	)

	if (isLoading) return (
		<Wrapper>
			<div>
				<p>Retrieving data ...</p>
			</div>
		</Wrapper>
	)

	if (isError) return (
		<Wrapper>
			<ErrorMessage error={error} text="Encountered an error fetching data. Please try again."/>
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
