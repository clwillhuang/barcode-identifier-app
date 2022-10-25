import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, Button, ListGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'
import SequencePreview from '../components/sequence-preview';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

const BlastDb = () => {

    let { databaseId } = useParams();
    let [database, setDatabase] = useState(undefined)
    let [loading, setLoad] = useState(true)

    // TODO: Handle bad requests / responses
    useEffect(() => {
        fetch(`${urlRoot}/blastdbs/${databaseId}`)
        .then((response) => response.json())
        .then((data) => {
          setDatabase(data)
          setLoad(false)
        } )
        .catch((e) => console.log(e))
      }, [databaseId])
    
    console.log("loading")

    return(
        <Wrapper>
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem active>This database</BreadcrumbItem>
            </Breadcrumb>
            {loading && <div>Retrieving database data ... </div>}
            {!loading && 
            <div>
                <h1>{database.custom_name}</h1>
                <Button variant='primary' className='align-middle my-4'>
                    <Link to={`/blast/?database=${database.id}`} className='text-white text-decoration-none'>Run a Query</Link>
                </Button>
                <ListGroup as='ol'>
                    {!loading && database.sequences.map(sequence => <SequencePreview sequence={sequence}/>)}
                </ListGroup>
            </div>
            }
            
        </Wrapper>
    )
}

export default BlastDb