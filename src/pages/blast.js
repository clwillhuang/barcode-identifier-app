import { useCallback, useEffect, useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel, FormSelect } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

function Blast() {

    let navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams()
    let [databases, setDatabases] = useState(true)
    let [loading, setLoad] = useState(true)

    const [fields, setFields] = useState({
        jobName: '',
        databaseSelect: searchParams.get('database'),
        querySequence: '',
    })

    let defaultSelected = searchParams.get('database') 
    if (!defaultSelected) defaultSelected = ''

    const setDefault = useCallback((defaultDb) => {
        console.log('again2')
        if (!fields.databaseSelect) setFields({...fields, databaseSelect: defaultDb})
    }, [fields])

    // retrieve list of possible dbs
    useEffect(() => {
        fetch(`${urlRoot}/blastdbs/`)
        .then((response) => response.json())
        .then((data) => {
          console.log('again')
          setDatabases(data)
          setDefault(data[0].id)
          setLoad(false)
        } )
        .catch((e) => console.log(e))
      }, [setDefault])

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

    return (
        <Wrapper>
            <h2>Submit BLAST Query</h2>
            {
                loading ? 
                <p>Loading form data ...</p>
                :
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel htmlFor='jobName'>Job Name (Optional)</FormLabel>
                        <FormControl id='jobName' name='jobName' as='input' placeholder='Name this query to remind yourself what this query was.' onChange={handleChange}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor='databaseSelect'>Blast Database</FormLabel>
                        <FormSelect aria-label='Select database to query on' name='databaseSelect' id='databaseSelect' defaultValue={defaultSelected} onChange={handleChange}>
                            {databases.map(db => <option value={db.id} key={db.id}>{db.custom_name}</option>)}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor='querySequence'>Query Sequence</FormLabel>
                        <FormControl id='querySequence' name='querySequence' as='textarea' rows={5} onChange={handleChange}></FormControl>
                    </FormGroup>
                    <Button type='submit' className='my-3'>Submit Query</Button>
                </Form>
            }

        </Wrapper>
    );
}

export default Blast;
