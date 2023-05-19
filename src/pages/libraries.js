import { Alert, ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import CustomHelmet from '../components/custom-helmet';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Layout from '../components/layout';
import Wrapper from '../components/wrapper';
import { generateHeaders, urlRoot } from '../url';
import LibraryPreview from './library-preview';

function Libraries() {
    const { isLoading, error, data, isError } = useQuery(['libraries'], () =>
        fetch(`${urlRoot}/libraries/`, {
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const helmet = <CustomHelmet
		title='Libraries'
		description={`Browse barcode reference libraries available to query against.`}
		canonical='/libraries'
	/>

    if (isLoading) return (
        <Wrapper>
            <Layout>
            {helmet}
            <div>
                <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                <p>Retrieving data ...</p>
            </div>
            </Layout>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <Layout>
                <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
            {helmet}
                <ErrorMessage error={error} text="Could not find reference libraries. Please try again." />
            </Layout>
        </Wrapper>
    )

    return (
        <Wrapper>
            <Layout>
                <div>
                    <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                    <h2>Reference Libraries</h2>
                </div>
                <ListGroup>
                    {data.map(library => <LibraryPreview library={library} key={library.id}></LibraryPreview>)}
                </ListGroup>
            </Layout>
        </Wrapper>
    )
}

export default Libraries;