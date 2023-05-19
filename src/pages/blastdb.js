import React from 'react'
import { Breadcrumb, BreadcrumbItem, Button, Col, Container, Row } from 'react-bootstrap';
import { FaLock, FaLockOpen, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
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

    const { libraryId, databaseId } = useParams();

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

    if (isLoading) return (
        <Wrapper>
            <Layout>
            <CustomHelmet
                title='BLAST Database'
                description='Browse a database version of a barcode reference library .'
                canonical='/libraries'
            />
            <div>
                <p>Retrieving data ...</p>
            </div>
            </Layout>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <Layout>
                <CustomHelmet
                    title='BLAST Database'
                    description='Browse a database version of a barcode reference library .'
                    canonical='/libraries'
                />
                <h1>Library version not found</h1>
                <ErrorMessage error={error} text="Could not find a library version / BLAST database matching the specified details. Check the website link and please try again." />
            </Layout>
        </Wrapper>
    )

    const { library: { custom_name, description, public: is_public_library, owner: { username } }, version_number, description: version_description, locked, sequences } = data

    return (
        <Wrapper>
            <Layout>
            <CustomHelmet
                title={`${custom_name}, ${version_number}`}
                description='Browse entries in this custom database.'
                canonical='database'
            />
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem href='/libraries'>Reference Libraries</BreadcrumbItem>
                <BreadcrumbItem href={`/libraries/${libraryId}`}>{custom_name}</BreadcrumbItem>
                <BreadcrumbItem active>Version {version_number}</BreadcrumbItem>
            </Breadcrumb>
            <div>
                <h1>"{custom_name}"</h1>
                <div className={styles.visibilityInfo}>
                    <p className='mt-0 mb-2 text-muted'>
                    {
                        is_public_library ? 
                        <><FaRegEye/> Public Database</> 
                        : 
                        <><FaRegEyeSlash/> Private Database</>
                    }
                    </p>
                    <span className='mx-2'>|</span>
                    <p className='text-muted'>
                    {
                        locked ?
                        <><FaLockOpen/> Unpublished</> :
                        <><FaLock/> Unpublished</>
                    }
                    </p>
                    <p className='mt-0 mb-2 text-muted'>
                    <span className='mx-2'>|</span>
                    Adminstered by {username}
                    </p>
                </div>
                <p>{description}</p>
                <h3>Version {version_number}</h3>
                <p>{version_description}</p>
                <Container className='g-0 mb-2'>
                    <Row className='d-flex align-items-center'>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle'>
                                <Link to={`/blast/?database=${data.id}`} className='text-white text-decoration-none'>Run a Query</Link>
                            </Button>
                        </Col>
                        <Col className='col-auto'>
                            <Button variant='secondary' className='align-middle text-white text-decoration-none mx-0' onClick={() => downloadFile('text/csv')}>
                                Export .csv
                            </Button>
                        </Col>
                        <Col className='col-auto'>
                            <Button variant='secondary' className='align-middle text-white text-decoration-none' onClick={() => downloadFile('text/x-fasta')}>
                                Export .fasta
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <h3>Database entries</h3>
                <p className='text-muted'>This database contains {sequences.length} entries.</p>
                <DbSummary sequences={sequences} />
                <DbTable data={sequences}></DbTable>
            </div>
            </Layout>
        </Wrapper>
    )
}

export default BlastDb