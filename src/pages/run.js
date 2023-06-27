import React, { useCallback, useState } from 'react'
import RunTable from '../components/run-table';
import { Accordion, Breadcrumb, BreadcrumbItem, Button, Col, Container, FormGroup, Modal, Row, Tab, Tabs, FormSelect, FormLabel } from 'react-bootstrap';

import { useParams, Link } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';
import { generateHeaders, urlRoot } from '../url';
import { useQuery } from 'react-query'
import styles from './run.module.css'
import { ErrorMessage, handleResponse } from '../components/error-message';
import CustomHelmet from '../components/custom-helmet';
import RunTreeTab from '../components/hit-tree';
import TaxonomyTable from '../components/taxonomy-table';

const Run = () => {
    const [errorText, setErrorText] = useState('');
    let { runId } = useParams();
    const [key, setKey] = useState('hits')
    const [selectedQuerySequence, setSelectedQuerySequence] = useState(undefined);

    const onHandleQueryChange = useCallback((event) => {
        setSelectedQuerySequence(event.target.value)
    }, [setSelectedQuerySequence])

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short',
        hour12: false,
    })

    const { isLoading, error, data: run, isError, isSuccess, errorUpdatedAt, dataUpdatedAt } = useQuery([`blast_run_${runId}`], () =>
        fetch(`${urlRoot}/runs/${runId}`, {
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
            onSuccess: (data) => {
                if (typeof selectedQuerySequence === 'undefined') {
                    setSelectedQuerySequence(data.queries.length > 0 ? 0 : undefined)
                }
            }
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
            <Layout>
                <div>
                    <p>Retrieving data ...</p>
                </div>
            </Layout>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            {helmet}
            <Layout>
                <h1>Run Results</h1>
                <ErrorMessage error={error} text={`Encountered an error fetching the data of run ${runId}. Please try again.`} />
            </Layout>
        </Wrapper>
    )

    const lastFetchDate = isError ? new Date(errorUpdatedAt) : isSuccess ? new Date(dataUpdatedAt) : null

    return (
        <Wrapper>
            {helmet}
            <Layout>
                <Breadcrumb>
                    <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                    <BreadcrumbItem href='/blast'>Run</BreadcrumbItem>
                    <BreadcrumbItem active>Results</BreadcrumbItem>
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
                            <Container className='g-0'>
                                <Row className='d-flex align-items-center pb-3'>
                                    <Col className='col-auto'>
                                        <span className='d-block' style={{ width: 'fit-content' }}>Export results as</span>
                                    </Col>
                                    {['csv', 'tsv', 'txt'].map(format => {
                                        return(
                                            <Col className='col-auto' key={format}>
                                                <a target='_blank' rel='noreferrer' className='text-nowrap' href={`${urlRoot}/runs/${runId}/download?format=${format}`}>
                                                    .{format}
                                                </a>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Container>
                            <FormGroup>
                                <FormLabel htmlFor='selectedQuerySequence'>Select a query sequence to browse hits:</FormLabel>
                                <FormSelect onChange={onHandleQueryChange} name='selectedQuerySequence'>
                                    {run.queries.map((query_seq, index) => 
                                        <option value={index} key={`opt_${index}`}>{query_seq.definition}</option>
                                    )}
                                </FormSelect>
                            </FormGroup>
                            {
                                (typeof selectedQuerySequence !== 'undefined') && 
                                <>
                                <div>
                                    <h5>Query Sequence Details</h5>
                                    <b>{run.definition}</b>
                                    <p>Originally reported identification: {run.queries[selectedQuerySequence].original_species_name ?? 'Unspecified'}</p>
                                    <h5>Classification Results</h5>
                                    <p>Classification by BLAST: {run.queries[selectedQuerySequence].results_species_name}</p>
                                    <p>BLAST run returned <strong>{run.queries[selectedQuerySequence].hits.length}</strong> hits</p>
                                </div>
                                <RunTable initialData={run.queries[selectedQuerySequence].hits}/>
                            </>
                        }
                        </Tab>
                        {
                            (run.create_db_tree || run.create_hit_tree) &&
                            <Tab eventKey='tree' title='Tree' className={styles.tabs}>
                                <RunTreeTab run_data={run} querySequences={run.queries} enabled={key === 'tree'} />
                            </Tab>
                        }
                        {
                            (run.create_hit_tree) && 
                            <Tab eventKey='taxonomy' title='Taxonomy' className={styles.tabs}>
                                <h3>Taxonomic Assignments</h3>
                                <Row className='d-flex align-items-center pb-3'>
                                    <Col className='col-auto'>
                                        <span className='d-block' style={{ width: 'fit-content' }}>Export taxonomy as</span>
                                    </Col>
                                    {['csv', 'tsv'].map(format => {
                                        return(
                                            <Col className='col-auto' key={format}>
                                                <a target='_blank' rel='noreferrer' className='text-nowrap' href={`${urlRoot}/runs/${runId}/download/taxonomy?format=${format}`}>
                                                    .{format}
                                                </a>
                                            </Col>
                                        )
                                    })}
                                </Row>
                                <TaxonomyTable initialData={run.queries}/>
                            </Tab>
                        }
                    </Tabs>
                </div>
                <hr />
                <div className={styles.parameters}>
                    <h3>Parameters</h3>
                    <strong>Job name</strong>
                    <pre>{run.job_name || '<no job name given>'}</pre>
                    <strong>Reference Library Used</strong>
                    <pre>
                        <Link to={`/libraries/${run.db_used.library.id}/`}>{run.db_used.library.custom_name}</Link>
                    </pre>
                    <pre className='mx-2'>
                        <Link to={`/libraries/${run.db_used.library.id}/version/${run.db_used.id}`}>Version {run.db_used.version_number} ({run.db_used.custom_name})</Link>
                    </pre>
                    <pre className='mx-2'>({run.db_used.library.marker_gene} reference database)</pre>
                    <strong>Unique Run Identifier</strong>
                    <pre>{runId}</pre>
                    <strong>Query Input</strong>
                    <pre>{run.queries.length} nucleotide sequence(s)</pre>
                </div>
                <Container className='g-0'>
                    <Row className='d-flex align-items-center pb-3'>
                        <Col className='col-auto'>
                            <span className='d-block' style={{ width: 'fit-content' }}>Download input as</span>
                        </Col>
                        <Col className='col-auto'>
                            <a target='_blank' rel='noreferrer' className='text-nowrap' href={`${urlRoot}/runs/${runId}/download/input`}>
                                .fasta
                            </a>
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
                            <p>The server received this job and added it to the queue at {dateFormatter.format(Date.parse(run.received_time))}</p>
                            {run.start_time &&
                                <p>The server began running this job at {dateFormatter.format(Date.parse(run.start_time))}</p>}
                            {run.end_time &&
                                <p>The server completed running this job at {dateFormatter.format(Date.parse(run.end_time))}</p>}
                            {run.error_time &&
                                <p>The server encountered an unexpected error and the job was terminated at {dateFormatter.format(Date.parse(run.error_time))}</p>}
                            <p></p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Layout>
        </Wrapper>
    )
}

export default Run