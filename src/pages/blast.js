import { useCallback, useState } from 'react';
import { Alert, Button, Form, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

function Blast() {

    let navigate = useNavigate()
    let [searchParams] = useSearchParams()
    let [responseError, setResponseError] = useState(null)
    let [sequenceInvalid, setSequenceInvalid] = useState(false)

    const [fields, setFields] = useState({
        jobName: '',
        databaseSelect: searchParams.get('database'),
        querySequence: '',
        queryFile: undefined,
    })

    let defaultSelected = searchParams.get('database')
    if (!defaultSelected) defaultSelected = ''

    const setDefault = useCallback((defaultDb) => {
        if (!fields.databaseSelect) setFields({ ...fields, databaseSelect: defaultDb })
    }, [fields])

    const { isLoading, error, data: dbs, isError } = useQuery(['blast_database_options'], () =>
        fetch(`${urlRoot}/blastdbs/`)
            .then(handleResponse()),
        {
            onSuccess: (data) => {
                setDefault(data[0].id)
            },
            refetchInterval: false,
            retry: false,
        }
    )

    const handleChange = (event) => {
        setFields({ ...fields, [event.target.name]: event.target.value })
        setSequenceInvalid(false)
        setResponseError(null)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (typeof window === 'undefined' || typeof window === 'undefined') {
            return
        }

        // TODO: Show an error if there is both a file upload AND a raw text sequence present
        // if (fields.querySequence.length < 4)
        //     return

        if (true) {
            const form_info = document.getElementById('blastForm')
            const formData = new FormData(form_info)
            let url = `${urlRoot}/blastdbs/${fields.databaseSelect}/run/`

            let postHeaders = {
                'Accept': 'application/json',
            }

            // TODO: Handle bad requests

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
        setFields({ ...fields, 'queryFile': event.target.files[0] })
    }

    if (isLoading) return (
        <Wrapper>
            <h2>Submit BLAST Run</h2>
            <p>Loading form data ...</p>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <h2>Submit BLAST Run</h2>
            <ErrorMessage error={error} />
        </Wrapper>
    )

    return (
        <Wrapper>
            <h2>Submit BLAST Run</h2>
            {
                responseError &&
                <Alert variant='danger'>
                    <Alert.Heading>Error</Alert.Heading>
                    {responseError}
                </Alert> 
            }
            <Form id='blastForm' onSubmit={handleSubmit}>
                <h5>Query Sequence</h5>
                <FormGroup className='my-3 mx-5'>
                    <FormLabel htmlFor='queryFile'>Upload sequence .fasta file</FormLabel>
                    <FormControl isInvalid={sequenceInvalid} id='queryFile' name='query_file' type='file' onChange={onFileChange}></FormControl>
                    <p className='my-1'>OR</p>
                    <FormLabel htmlFor='querySequence'>Paste raw sequence text</FormLabel>
                    <FormControl isInvalid={sequenceInvalid} id='querySequence' name='query_sequence' as='textarea' rows={5} onChange={handleChange} placeholder='Paste sequence as single line by itself, without comments, definitions and headers.'></FormControl>
                    <Form.Control.Feedback type="invalid">
                        {"Error: " + responseError}
                    </Form.Control.Feedback>
                </FormGroup>
                <h5>Query Parameters</h5>
                <FormGroup className='my-3 mx-5'>
                    <FormLabel htmlFor='jobName'>Job Name (Optional)</FormLabel>
                    <FormControl id='jobName' name='job_name' as='input' placeholder='Name this query to remind yourself what this query was.' onChange={handleChange}></FormControl>
                </FormGroup>
                <FormGroup className='my-3 mx-5'>
                    <FormLabel htmlFor='databaseSelect'>Blast Database</FormLabel>
                    <FormSelect aria-label='Select database to query on' name='id' id='databaseSelect' defaultValue={defaultSelected} onChange={handleChange}>
                        {dbs.map(db => <option value={db.id} key={db.id}>{db.custom_name}</option>)}
                    </FormSelect>
                </FormGroup>
                
                <Button disabled={responseError} type='submit' className='my-3'>Submit Query</Button>
            </Form>
        </Wrapper>
    );
}

export default Blast;
