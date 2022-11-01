import React from 'react'
import RunTable from '../components/run-table';
import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup } from 'react-bootstrap';

import { useParams, Link } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';
import { useQuery } from 'react-query'
import './run.css'

const Run = () => {

    let { runId } = useParams();

    // TODO: Handle bad requests / responses
    const { isLoading, error, data: run } = useQuery([`blast_run_${runId}`], () =>
        fetch(`${urlRoot}/runs/${runId}`)
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

    return (
        <Wrapper>
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem href='/blast'>Run</BreadcrumbItem>
                <BreadcrumbItem active>Run results</BreadcrumbItem>
            </Breadcrumb>
            <div>
                <h1>blastn Results</h1>
                <h3>Parameters</h3>
                <p>Job name: <pre>{run.job_name}</pre></p>
                <p>Database used: <pre><Link to={`/database/${run.db_used.id}`}>{run.db_used.custom_name}</Link></pre></p>
                <p>Unique Run Identifier: <pre>{runId}</pre></p>
                <p>Query sequence:
                <pre>{run.query_sequence}</pre></p>
                <h3>Hits</h3>
                <RunTable data={run.hits} />
            </div>
            <ButtonGroup>
                <Button variant='primary' className='align-middle my-4'>
                    <Link to={`/blast/`} className='text-white text-decoration-none'>Run new query</Link>
                </Button>
                <Button variant='secondary' className='align-middle my-4'>
                    <Link to={`/blast/?database=${run.db_used.id}`} className='text-white text-decoration-none'>Run new query with same database</Link>
                </Button>
            </ButtonGroup>


        </Wrapper>
    )
}

export default Run