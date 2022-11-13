import { useCallback, useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

function Blast() {

    let navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams()

    const [fields, setFields] = useState({
        jobName: '',
        databaseSelect: searchParams.get('database'),
        querySequence: '',
    })

    let defaultSelected = searchParams.get('database') 
    if (!defaultSelected) defaultSelected = ''

    const setDefault = useCallback((defaultDb) => {
        if (!fields.databaseSelect) setFields({...fields, databaseSelect: defaultDb})
    }, [fields])

    // TODO: handle error fetches
    const { isLoading, error, data: dbs } = useQuery(['blast_database_options'], () => 
        fetch(`${urlRoot}/blastdbs/`)
        .then((response) => response.json()),
        {
            onSuccess: (data) => {
                setDefault(data[0].id)
            }
        }
    )

    const handleChange = (event) => {
        setFields({...fields, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(fields)

        if (fields.querySequence.length < 4)
            return

        let postBody = {
            'query_sequence': fields.querySequence,
            'id': fields.databaseSelect,
            'job_name': fields.jobName
        }
        let postHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // TODO: Handle bad requests / responses
        let url = `${urlRoot}/blastdbs/${fields.databaseSelect}/run/`
        fetch(url, { method: 'POST', headers: postHeaders, mode: 'cors', body: JSON.stringify(postBody)})
        .then((response) => response.json())
        .then((data) => {
            navigate(`/run/${data.id}`)
        })
        .catch((e) => console.log(e))
    }

    if (isLoading) return(
        <Wrapper>
            <h2>Submit BLAST Query</h2>
            <p>Loading form data ...</p>
        </Wrapper>
    )

    if (error) return(
        <Wrapper>
            <h2>Submit BLAST Query</h2>
            <b>Error: failed to fetch form</b>
        </Wrapper>
    )

    return (
        <Wrapper>
            <h2>Submit BLAST Query</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel htmlFor='jobName'>Job Name (Optional)</FormLabel>
                    <FormControl id='jobName' name='jobName' as='input' placeholder='Name this query to remind yourself what this query was.' onChange={handleChange}></FormControl>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor='databaseSelect'>Blast Database</FormLabel>
                    <FormSelect aria-label='Select database to query on' name='databaseSelect' id='databaseSelect' defaultValue={defaultSelected} onChange={handleChange}>
                        {dbs.map(db => <option value={db.id} key={db.id}>{db.custom_name}</option>)}
                    </FormSelect>
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor='querySequence'>Query Sequence</FormLabel>
                    <FormControl id='querySequence' name='querySequence' as='textarea' rows={5} onChange={handleChange} placeholder='Paste sequence as single line by itself, without comments, definitions and headers.'></FormControl>
                </FormGroup>
                <Button type='submit' className='my-3'>Submit Query</Button>
            </Form>
        </Wrapper>
    );
}

export default Blast;
