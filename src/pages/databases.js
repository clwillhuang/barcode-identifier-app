import { Alert, ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import BlastDbPreview from '../components/blastdb-preview';
import CustomHelmet from '../components/custom-helmet';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Layout from '../components/layout';
import Wrapper from '../components/wrapper';
import { generateHeaders, urlRoot } from '../url';

function Databases() {
    const { isLoading, error, data, isError } = useQuery(['home_databases'], () =>
        fetch(`${urlRoot}/blastdbs/`, {
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const helmet = <CustomHelmet
		title='Databases'
		description={`Browse barcode databases available to query against.`}
		canonical=''
	/>

    if (isLoading) return (
        <Wrapper>
            {helmet}
            <div>
                <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                <p>Retrieving data ...</p>
            </div>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
            {helmet}
            <ErrorMessage error={error} text="Encountered an error fetching data. Please try again." />
        </Wrapper>
    )

    return (
        <Wrapper>
            <Layout>
                <div>
                    <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                    <h2>Databases available</h2>
                    <p>Found {data.length} blast database(s) available for queries.</p>
                </div>
                <ListGroup>
                    {data.map(db => <BlastDbPreview database={db} key={db.id}></BlastDbPreview>)}
                </ListGroup>
            </Layout>
        </Wrapper>
    )
}

export default Databases;