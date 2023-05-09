import React from 'react'
import { Breadcrumb, BreadcrumbItem, Button, Col, Container, Row } from 'react-bootstrap';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import CustomHelmet from '../components/custom-helmet';
import DbSummary from '../components/db-summary';
import DbTable from '../components/db-table';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Layout from '../components/layout';
import Wrapper from '../components/wrapper';
import { generateHeaders, urlRoot } from '../url';
import styles from './blastdb.module.css'

const BlastDb = () => {

    const { databaseId } = useParams();

    const { isLoading, error, data, isError } = useQuery([`blastdb_${databaseId}`], () =>
        fetch(`${urlRoot}/blastdbs/${databaseId}`, {
            mode: 'cors',
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const downloadFile = (format) => {
        const types = { 'text/csv': 'csv', 'text/x-fasta': 'fasta' }

        if (typeof window === 'undefined') {
            console.error("Cannot download CSV file with window undefined.")
            return
        } else if (!Object.keys(types).includes(format)) {
            console.error(`The format ${format} is not available for export.`)
            return
        }

        fetch(`${urlRoot}/blastdbs/${databaseId}`, {
            method: `GET`,
            headers: generateHeaders({
                'Accept': format
            })
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob])
                )
                const link = document.createElement('a',)
                link.href = url
                link.setAttribute('download', `results.${types[format]}`)
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
            })
    }

    const helmet = <CustomHelmet
        title='Custom database'
        description='Browse entries in this custom database.'
        canonical='database'
    />

    if (isLoading) return (
        <Wrapper>
            <Layout>
            {helmet}
            <div>
                <p>Retrieving data ...</p>
            </div>
            </Layout>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <Layout>
                {helmet}
                <h1>Blast database not found</h1>
                <ErrorMessage error={error} text="Encountered an error fetching databases. Please try again." />
            </Layout>
        </Wrapper>
    )

    return (
        <Wrapper>
            <Layout>
            {helmet}
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem href='/databases'>Databases</BreadcrumbItem>
                <BreadcrumbItem active>{data.custom_name}</BreadcrumbItem>
            </Breadcrumb>
            <div>
                <h1>"{data.custom_name}"</h1>
                <div className={styles.visibilityInfo}>
                    <p className='mt-0 mb-2 text-muted'>
                    {
                        data.public ? 
                        <><FaRegEye />Public Database</> 
                        : 
                        <><FaRegEyeSlash/> Private Database</>
                    }
                    </p>
                    <p className='mt-0 mb-2 text-muted'>
                    <span className='mx-2'>|</span>
                    Adminstered by {data.owner.username}
                    </p>
                </div>
                <p>{data.description}</p>
                <Container className='g-0 mb-2'>
                    <Row className='d-flex align-items-center'>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle'>
                                <Link to={`/blast/?database=${data.id}`} className='text-white text-decoration-none'>Run a Query</Link>
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <h3>Database entries</h3>
                <p className='text-muted'>This database contains {data.sequences.length} entries.</p>
                <DbSummary sequences={data.sequences} />
                <DbTable data={data.sequences}></DbTable>
                <h3>Export</h3>
                <Container className='g-0'>
                    <Row className='d-flex align-items-center pb-3'>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle text-white text-decoration-none mx-0' onClick={() => downloadFile('text/csv')}>
                                .csv
                            </Button>
                        </Col>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle text-white text-decoration-none' onClick={() => downloadFile('text/x-fasta')}>
                                .fasta
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
            </Layout>
        </Wrapper>
    )
}

export default BlastDb