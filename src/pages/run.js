import React, { useState } from 'react'
import RunTable from '../components/run-table';
import { Accordion, Breadcrumb, BreadcrumbItem, Button, Col, Container, Modal, Row, Tab, Tabs } from 'react-bootstrap';

import { useParams, Link } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';
import { useQuery } from 'react-query'
import styles from './run.module.css'
import { ErrorMessage, handleResponse } from '../components/error-message';
import CustomHelmet from '../components/custom-helmet';
import RunTree from '../components/hit-tree';

const Run = () => {
    const [errorText, setErrorText] = useState('');
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
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error(`${response.status}: ${response.statusText}`);
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a',);
                link.href = url;
                link.setAttribute('download', `results.${format}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(err => { setErrorText(err.message); })
    }

    const downloadInput = () => {
        fetch(`${urlRoot}/runs/${runId}/input-download`)
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a',);
                link.href = url;
                link.setAttribute('download', `query.fasta`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(err => { setErrorText(err.message); })
    }

    const [key, setKey] = useState('hits')

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
            <ErrorMessage error={error} text={`Encountered an error fetching the data of run ${runId}. Please try again.`} />
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
            <Modal show={errorText} backdrop='static' keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Unexpected Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>{errorText}</strong>
                    <p>Please try again. If the error persists, contact the site adminstrator.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setErrorText('')}>Close</Button>
                </Modal.Footer>
            </Modal>
            <div>
                <h1>blastn Results</h1>
                <p className='text-muted'>Last updated: {lastFetchDate ? dateFormatter.format(lastFetchDate) : 'Never'}</p>
                <hr />
                <Tabs activeKey={key} onSelect={(newKey) => setKey(newKey)}>
                    <Tab eventKey='hits' title='Hits' className={styles.tabs}>
                        <h3>Hits</h3>
                        <p>BLAST run returned <strong>{run.hits.length}</strong> hits</p>
                        {
                            run.hits.length > 0 &&
                            <React.Fragment>
                                <Container className='g-0'>
                                    <Row className='d-flex align-items-center pb-3'>
                                        <Col className='col-auto'>
                                            <span className='d-block' style={{ width: 'fit-content' }}>Download results as</span>
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
                                <RunTable initialData={run.hits} />
                            </React.Fragment>
                        }
                    </Tab>
                    <Tab eventKey='tree' title='Tree' className={styles.tabs}>
                        <h3>Phylogenetic tree of hits and query sequences</h3>
                        <p>Multiple sequence alignment by ClustalOmega and tree construction by SimplePhylogeny at EBML-EBI</p>
                        <RunTree runId={runId} enabled={key==='tree'} querySequences={run.queries.map(q => q.definition)}/>
                    </Tab>
                </Tabs>
            </div>
            <hr />
            <div className={styles.parameters}>
            <h3>Parameters</h3>
            <strong>Job name</strong>
            <pre>{run.job_name || '<no job name given>'}</pre>
            <strong>Database used</strong>
            <pre><Link to={`/database/${run.db_used.id}`}>{run.db_used.custom_name}</Link></pre>
            <strong>Unique Run Identifier</strong>
            <pre>{runId}</pre>
            <strong>Query Input</strong>
            <pre>{run.queries.length} nucleotide sequence(s): {run.queries.map(q => q.definition).join()}</pre>
            </div>
            <Container className='g-0'>
                <Row className='d-flex align-items-center pb-3'>
                    <Col className='col-auto'>
                        <span className='d-block' style={{ width: 'fit-content' }}>Download input as</span>
                    </Col>
                    <Col className='col-auto'>
                        <Button variant='primary' className='align-middle text-white text-decoration-none mx-0' onClick={() => downloadInput()}>
                            .fasta
                        </Button>
                    </Col>
                </Row>
            </Container>
            <hr />
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
            <hr />
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