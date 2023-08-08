import { Alert, ListGroup, FormSelect, FormGroup, Form, FormLabel } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useState } from 'react';
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

    const markerGeneOptions = ['Any', 'CO1', '18S', '16S', '12S', 'CytB', 'ITS']

    const [selectedGene, setSelectedGene] = useState(markerGeneOptions[0])

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

    const libraries = selectedGene === 'Any' ? data : data.filter(l => l.marker_gene === selectedGene)

    return (
        <Wrapper>
            {helmet}
            <Layout>
                <div>
                    <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                    <h2>Reference Libraries</h2>
                </div>
                <Form id='librariesMarkerGene' className='col-12 col-md-5 col-lg-3 my-4'>
                    <FormGroup>
                        <FormLabel htmlFor='markerGene'>Marker Gene</FormLabel>
                        <FormSelect id='markerGene' name='markerGene' onChange={(event) => setSelectedGene(event.target.value)} defaultValue={markerGeneOptions[0]}>
                            {
                                markerGeneOptions.map(markerGene =>
                                    <option key={markerGene} value={markerGene}>{markerGene}</option>
                                )
                            }
                        </FormSelect>
                    </FormGroup>
                </Form>
                <ListGroup>
                    {
                        libraries.length > 0 ?
                        libraries.map(library => <LibraryPreview library={library} key={library.id}></LibraryPreview>)
                        : 
                        <p>There are no reference libraries published for the {selectedGene} marker gene.</p>
                    }
                </ListGroup>
            </Layout>
        </Wrapper>
    )
}

export default Libraries;