import React from 'react'
import RunTable from '../components/run-table';
import { Accordion, Breadcrumb, BreadcrumbItem, Button, Col, Container, Row } from 'react-bootstrap';

import { useParams, Link } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';
import { useQuery } from 'react-query'
import './run.css'
import { ErrorMessage, handleResponse } from '../components/error-message';
import CustomHelmet from '../components/custom-helmet';

const Run = () => {

    let { runId } = useParams();
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short',
        hour12: false,
    })

    const downloadFile = (format) => {
        if (typeof window === 'undefined') {
            console.error('Cannot download CSV file with window undefined.')
            return 
        } else if (!(['txt', 'csv'].includes(format))) {
            console.error(`Format .${format} is not available for export.`)
            return
        }

        fetch(`${urlRoot}/runs/${runId}/download?format=${format}`)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob])
                )
                const link = document.createElement('a', )
                link.href = url 
                link.setAttribute('download', `results.${format}`) 
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
            })
        
    }

    const { isLoading, error, data: run, isError, isSuccess, errorUpdatedAt, dataUpdatedAt } = useQuery([`blast_run_${runId}`], () =>
        fetch(`${urlRoot}/runs/${runId}`)
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const helmet = <CustomHelmet
		title='Run results'
		description='Get the results of your query on a curated reference library of Neotropical electric fish sequences.'
		canonical='run'
	/>

    if (isLoading) return (
        <Wrapper>
            {helmet}
            <div>
                <p>Retrieving data ...</p>
            </div>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            {helmet}
            <h1>Run Results</h1>
            <ErrorMessage error={error} text={`Encountered an error fetching the data of run ${runId}. Please try again.`}/>
        </Wrapper>
    )

    const lastFetchDate = isError ? new Date(errorUpdatedAt) : isSuccess ? new Date(dataUpdatedAt) : null

    return (
        <Wrapper>
            {helmet}
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem href='/blast'>Run</BreadcrumbItem>
                <BreadcrumbItem active>Run results</BreadcrumbItem>
            </Breadcrumb>
            <div>
                <h1>blastn Results</h1>
                <p className='text-muted'>Last updated: {lastFetchDate ? dateFormatter.format(lastFetchDate) : 'Never'}</p>
                <Container className='g-0'>
                    <Row className='d-flex align-items-center pb-3'>
                        <Col className='col-auto'>
                            <span className='d-block' style={{width: 'fit-content'}}>Download as</span>
                        </Col>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle text-white text-decoration-none mx-0' onClick={() => downloadFile('csv')}>
                                .csv
                            </Button>
                        </Col>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle text-white text-decoration-none' onClick={() => downloadFile('txt')}>
                                .txt
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <h3>Parameters</h3>
                <strong>Job name</strong>
                <pre>{run.job_name || '<no job name given>'}</pre>
                <strong>Database used</strong>
                <pre><Link to={`/database/${run.db_used.id}`}>{run.db_used.custom_name}</Link></pre>
                <strong>Unique Run Identifier</strong>
                <pre>{runId}</pre>
                <strong>{'Query sequence(s)'}</strong>
                <pre>{run.queries.map(query => query.definition).join(', ')}</pre>
                <h3>Hits</h3>
                <RunTable initialData={run.hits} />               
            </div>
            <Container className='g-0'>
                <Row className='py-3'>
                    <Col className='col-auto'>
                        <Button variant='primary' className='align-middle my-1'>
                            <Link to={`/blast/`} className='text-white text-decoration-none'>Run new query</Link>
                        </Button>
                    </Col>
                    <Col className='col-auto'>
                        <Button variant='secondary' className='align-middle my-1'>
                            <Link to={`/blast/?database=${run.db_used.id}`} className='text-white text-decoration-none'>Run new query with same database</Link>
                        </Button>
                    </Col>
                </Row>
            </Container>
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


        </Wrapper>
    )
}

export default Run