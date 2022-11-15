import React from 'react'
import RunTable from '../components/run-table';
import { Accordion, Breadcrumb, BreadcrumbItem, Button, ButtonGroup } from 'react-bootstrap';

import { useParams, Link } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';
import { useQuery } from 'react-query'
import './run.css'

const Run = () => {

    let { runId } = useParams();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short',
        hour12: false,
    })
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
                <strong>Job name</strong>
                <pre>{run.job_name}</pre>
                <strong>Database used</strong>
                <pre><Link to={`/database/${run.db_used.id}`}>{run.db_used.custom_name}</Link></pre>
                <strong>Unique Run Identifier</strong>
                <pre>{runId}</pre>
                <strong>Query sequence</strong>
                <pre>{run.query_sequence}</pre>
                <h3>Hits</h3>
                <RunTable initialData={run.hits} />               
            </div>
            <Accordion>
                <Accordion.Item eventKey='0'>
                    <Accordion.Header>View server log</Accordion.Header>
                    <Accordion.Body>
                        <p>The server received this job and added it to the queue at {dateFormatter.format(Date.parse(run.runtime))}</p>
                        {run.job_start_time &&
                            <p>The server began running this job at {dateFormatter.format(Date.parse(run.job_start_time))}</p>}
                        {run.job_end_time &&
                            <p>The server completed running this job at {dateFormatter.format(Date.parse(run.job_end_time))}</p>}
                        <p></p>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
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