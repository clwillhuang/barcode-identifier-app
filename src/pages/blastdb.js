import React from 'react'
import { Breadcrumb, BreadcrumbItem, Button, ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import SequencePreview from '../components/sequence-preview';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

const BlastDb = () => {

    let { databaseId } = useParams();

    const { isLoading, error, data } = useQuery([`blastdb_${databaseId}`], () => 
        fetch(`${urlRoot}/blastdbs/${databaseId}`)
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

    return(
        <Wrapper>
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem active>This database</BreadcrumbItem>
            </Breadcrumb>
            <div>
                <h1>{data.custom_name}</h1>
                <Button variant='primary' className='align-middle my-4'>
                    <Link to={`/blast/?database=${data.id}`} className='text-white text-decoration-none'>Run a Query</Link>
                </Button>
                <ListGroup as='ol'>
                    {data.sequences.map(sequence => <SequencePreview sequence={sequence}/>)}
                </ListGroup>
            </div>
        </Wrapper>
    )
}

export default BlastDb