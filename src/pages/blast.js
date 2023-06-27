import { useState } from 'react';
import { Alert, Button, Form, FormCheck, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomHelmet from '../components/custom-helmet';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';
import { generateHeaders, urlRoot } from '../url';
import { FaPaperPlane } from 'react-icons/fa'

function Blast() {

    let navigate = useNavigate();
    let [searchParams] = useSearchParams();
    let [responseError, setResponseError] = useState(null);
    let [sequenceInvalid, setSequenceInvalid] = useState(false);

    const markerGeneOptions = ['Any', 'CO1', '18S', '16S', '12S', 'CytB', 'ITS']

    const [fields, setFields] = useState({
        markerGene: markerGeneOptions[0],
        job_name: '',
        librarySelect: searchParams.get('library') ?? undefined,
        databaseSelect: searchParams.get('database') ?? undefined,
        create_hit_tree: searchParams.get('createHitTree') ?? false,
        create_db_tree: searchParams.get('createDbTree') ?? false,
        query_file: undefined,
    })

    const { isLoading: isLibraryLoading, error: libraryError, data: libraryData, isError: isLibraryError } = useQuery(['blast_library_options'], () =>
        fetch(`${urlRoot}/libraries/`, {
            headers: generateHeaders({}),
        })
            .then(handleResponse()),
        {
            onSuccess: (data) => {
                let librarySelection = undefined;
                if (data.length > 0) {
                    librarySelection = data.find(library => library.id === fields.librarySelect) ?? data[0]
                }
                setFields({ ...fields, librarySelect: librarySelection.id })
            },
            refetchInterval: false,
            retry: false,
        }
    )

    const { isFetching: isDatabaseFetching, error: databaseError, data: databaseData, isError: isDatabaseError } = useQuery([`database_${fields.librarySelect}`], () =>
        fetch(`${urlRoot}/libraries/${fields.librarySelect.toString()}/versions`, {
            headers: generateHeaders({}),
        })
            .then(handleResponse()),
        {
            onSuccess: (data) => {
                let databaseSelection = undefined;
                if (data.length > 0)
                    databaseSelection = data.find(database => database.id === fields.databaseSelect) ?? data[0];
                setFields({ ...fields, databaseSelect: databaseSelection.id })
            },
            enabled: fields.librarySelect !== undefined,
            refetchInterval: false,
            retry: false,
            initialData: []
        }
    )

    const handleChange = (event) => {
        if (event.target.type === 'checkbox') {
            setFields({ ...fields, [event.target.name]: event.target.checked })
        } else {
            setFields({ ...fields, [event.target.name]: event.target.value })
        }
        setSequenceInvalid(false)
        setResponseError(null)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (typeof window === 'undefined' || typeof window === 'undefined') {
            return
        }

        if (true) {
            const form_info = document.getElementById('blastForm')
            let formData = new FormData(form_info)
            let d = ['create_db_tree', 'create_hit_tree']
            d.forEach(key => {
                if (formData.has(key)) {
                    formData.set(key, formData.get(key) === 'true')
                }
            })

            let url = `${urlRoot}/blastdbs/${fields.databaseSelect}/run/`

            let postHeaders = generateHeaders({
                'Accept': 'application/json',
            })

            fetch(url, { method: 'POST', headers: postHeaders, mode: 'cors', body: formData })
                .then(response => {
                    if (response.status === 400) {
                        // a known error
                        response.json().then(error => {
                            setResponseError(error.message)
                            setSequenceInvalid(true)
                        })
                    } else if (response.status === 201) {
                        // successful post
                        response.json().then(data => {
                            navigate(`/run/${data.id}/status`)
                        })
                    } else if (!response.ok) {
                        // unexpected error
                        setResponseError(`Error ${response.status}: ${response.statusText}.`)
                        throw new Error()
                    }
                })
                .catch(error => {
                    console.log(`The website encountered an unexpected error.`)
                })


        }
    }

    const onFileChange = (event) => {
        setFields({ ...fields, 'query_file': event.target.files[0] })
        setSequenceInvalid(false)
        setResponseError(null)
    }

    const error = isDatabaseError ? databaseError : (isLibraryError ? libraryError : undefined);

    const renderDatabaseOptions = () => {
        if (isDatabaseError) {
            return (
                <Alert variant='danger'>Could not retrieve a matching database.</Alert>
            )
        } else if (!isDatabaseFetching && (databaseData === null || databaseData.length === 0)) {
            return (
                <Alert variant='danger'>No BLAST databases are published for this reference library</Alert>
            )
        } else {
            return (
                <FormGroup className='my-3 mx-5'>
                    <FormLabel htmlFor='databaseSelect'>Library Version</FormLabel>
                    <FormSelect aria-label='Select database to query on' name='databaseSelect' id='databaseSelect' defaultValue={fields.databaseSelect} onChange={handleChange}>
                        {databaseData.map(db => <option value={db.id} key={db.id}>Version {db.version_number}, "{db.custom_name}" ({db.id})</option>)}
                    </FormSelect>
                    <div className='d-flex justify-content-end'>
                        <a target='_blank' rel='noreferrer' style={{ fontSize: '0.9em', textAlign: 'right' }} href={`/libraries/${fields.librarySelect}/version/${fields.databaseSelect}`}>Browse this database</a>
                    </div>
                </FormGroup>
            )
        }
    }

    if (isLibraryLoading) return (
        <Wrapper>
            {customHelmet()}
            <Layout>
                <h2>Submit BLAST Run</h2>
                <p>Loading form data ...</p>
            </Layout>
        </Wrapper>
    )

    if (isLibraryError) return (
        <Wrapper>
            {customHelmet()}
            <Layout>
                <h2>Submit BLAST Run</h2>
                <ErrorMessage error={error} />
            </Layout>
        </Wrapper>
    )

    const libraries = fields.markerGene === markerGeneOptions[0] ? libraryData : libraryData.filter(lib => lib.marker_gene === fields.markerGene)

    return (
        <Wrapper>
            {customHelmet()}
            <Layout>
                <h2>Submit BLAST Run</h2>
                {
                    responseError &&
                    <Alert variant='danger'>
                        <Alert.Heading>Error</Alert.Heading>
                        {responseError}
                    </Alert>
                }
                <Form id='blastForm' onSubmit={handleSubmit} className='col-12'>

                    <h5>Query Sequence</h5>
                    <FormGroup className='my-3 mx-5'>
                        <FormLabel htmlFor='queryFile'>Upload sequence .fasta file</FormLabel>
                        <FormControl isInvalid={sequenceInvalid} id='queryFile' name='query_file' type='file' onChange={onFileChange}></FormControl>
                        <strong className='my-1'>OR</strong><br />
                        <FormLabel htmlFor='querySequence'>Paste raw sequence text</FormLabel>
                        <FormControl isInvalid={sequenceInvalid} id='querySequence' name='query_sequence' as='textarea' rows={5} onChange={handleChange} placeholder='Provide sequences in FASTA format'></FormControl>
                        <Form.Control.Feedback type="invalid">
                            {"Error: " + responseError}
                        </Form.Control.Feedback>
                    </FormGroup>

                    <h5>Nucleotide BLAST Parameters</h5>
                    <FormGroup className='my-3 mx-5'>
                        <FormLabel htmlFor='markerGene'>Marker Gene</FormLabel>
                        <FormSelect aria-label='Select marker gene library to query one' name='markerGene' id='markerGene' defaultValue={markerGeneOptions[0]} onChange={handleChange}>
                            {markerGeneOptions.map(markerGene => <option value={markerGene} key={markerGene.id}>{markerGene}</option>)}
                        </FormSelect>
                    </FormGroup>
                    {
                        (libraries.length) > 0 ?
                            <>
                                <FormGroup className='my-3 mx-5'>
                                    <FormLabel htmlFor='librarySelect'>Reference Library</FormLabel>
                                    <FormSelect aria-label='Select reference library to query on' name='librarySelect' id='librarySelect' defaultValue={libraries[0].id} onChange={handleChange}>
                                        {libraries.map(library => <option value={library.id} key={library.id}>{library.custom_name} ({library.id})</option>)}
                                    </FormSelect>
                                    <div className='d-flex justify-content-end'>
                                        <a target='_blank' rel='noreferrer' style={{ fontSize: '0.9em', textAlign: 'right' }} href={`/libraries/${fields.librarySelect}`}>Browse this reference library</a>
                                    </div>
                                </FormGroup>
                                {renderDatabaseOptions()}
                            </>
                            :
                            <Alert variant='danger' className='mx-5'>{fields.markerGene === markerGeneOptions[0] ? 'No reference libraries found' : `No reference libraries found for ${fields.markerGene}`}</Alert>
                    }
                    <h5>Multiple Alignment Parameters</h5>
                    <FormGroup className='my-3 mx-5'>
                        <FormCheck id='createHitTree' name='create_hit_tree' type='checkbox' value={fields.create_hit_tree} onChange={handleChange} label='Construct tree with only queries and hits (Create hit tree), and evaluate accuracy of species identities'></FormCheck>
                    </FormGroup>
                    <FormGroup className='my-3 mx-5'>
                        <FormCheck id='createDbTree' name='create_db_tree' type='checkbox' onChange={handleChange} value={fields.create_db_tree} label='Construct tree with queries and all database sequences (Create database tree)'></FormCheck>
                    </FormGroup>
                    <h5>Job Name</h5>
                    <FormGroup className='my-3 mx-5'>
                        <FormLabel htmlFor='jobName'>Provide this run with a custom name (optional)</FormLabel>
                        <FormControl id='jobName' name='job_name' as='input' placeholder='' onChange={handleChange}></FormControl>
                    </FormGroup>
                    {databaseData.length > 0 ? <Button disabled={responseError} type='submit' className='my-3'><FaPaperPlane style={{ marginRight: '5px', marginBottom: '2px' }} />Submit Query</Button> :
                        <p className='text-danger'>No job submission possible. No eligible databases found.</p>}
                </Form>
            </Layout>
        </Wrapper>
    );

    function customHelmet() {
        return <CustomHelmet
            title='Submit run'
            description='Submit nucleotide sequences to run BLAST against the barcode database.'
            canonical='blast' />;
    }
}

export default Blast;
