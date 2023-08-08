import React, { useCallback } from 'react'
import { Breadcrumb, BreadcrumbItem, Button, Col, Container, Row } from 'react-bootstrap';
import { FaLock, FaLockOpen, FaRegEye, FaRegEyeSlash, FaInfoCircle } from 'react-icons/fa';
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

    const downloadFormats = [
        {
            export_format: '',
            title: 'Basic Export',
            formats: ['fasta', 'csv', 'tsv', 'xml', 'json']
        },
        {
            export_format: 'qiime2',
            title: 'QIIME2',
            formats: ['zip']
        },
        {
            export_format: 'dada2tax',
            title: 'DADA2 (assignTaxonomy)',
            formats: ['fasta', 'zip']
        },
        {
            export_format: 'dada2sp',
            title: 'DADA2 (assignSpecies)',
            formats: ['fasta', 'zip']
        },
        {
            export_format: 'sintax',
            title: 'SINTAX (USEARCH)',
            formats: ['fasta', 'zip']
        },
        {
            export_format: 'rdp',
            title: 'RDP Classifier',
            formats: ['zip']
        },
        {
            export_format: 'mothur',
            title: 'Mothur',
            formats: ['zip']
        }
    ]

    const renderRunButton = useCallback(() => {
        if (data.locked) {
            return (
                <Link to={`/blast/?database=${data.id}`} className='text-white text-decoration-none button-primary'>
                    <Button variant='primary' className='align-middle'>
                        Run a Query
                    </Button>
                </Link>
            )
        } else {
            return (
                <p><FaInfoCircle />This database has not been published yet, so no BLAST queries can be run.</p>)
        }
    }, [data])

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

    const { library: { custom_name, marker_gene, description, public: is_public_library, owner: { username } }, version_number, description: version_description, locked, sequence_count: sequenceCount, custom_name: version_custom_name } = data

    return (
        <Wrapper>
            <Layout>
                <CustomHelmet
                    title={`${custom_name}, ${version_number}`}
                    description='Browse entries in this custom database.'
                    canonical='database'
                />
                <Breadcrumb>
                    <BreadcrumbItem href='/app/'>Home</BreadcrumbItem>
                    <BreadcrumbItem href='/app/libraries'>Reference Libraries</BreadcrumbItem>
                    <BreadcrumbItem href={`/app/libraries/${libraryId}`}>{custom_name}</BreadcrumbItem>
                    <BreadcrumbItem active>Version {version_number} ("{version_custom_name}")</BreadcrumbItem>
                </Breadcrumb>

                <div>
                    <span className={styles.header}>
                        <h1>{custom_name} </h1>
                        <p>{marker_gene} Reference Library</p>
                    </span>

                    <div className={styles.visibilityInfo}>
                        <p className='mt-0 mb-2 text-muted'>
                            {
                                is_public_library ?
                                    <><FaRegEye /> Public Database</>
                                    :
                                    <><FaRegEyeSlash /> Private Database</>
                            }
                        </p>
                        <span className='mx-2'>|</span>
                        <p className='text-muted'>
                            {
                                locked ?
                                    <><FaLockOpen /> Published</> :
                                    <><FaLock /> Unpublished</>
                            }
                        </p>
                        <p className='mt-0 mb-2 text-muted'>
                            <span className='mx-2'>|</span>
                            Adminstered by {username}
                        </p>
                    </div>
                    <p>{description}</p>
                    <h3>Version {version_number} ("{version_custom_name}")</h3>
                    <p>{version_description}</p>
                    <Container className='g-0 mb-3'>
                        {renderRunButton()}
                        <Row className='my-3'>
                            <Col className='col-12 col-sm-7'>
                                <h3>Summary</h3>
                                <p className='text-muted'>Number of sequences: {sequenceCount}</p>
                                <DbSummary id={databaseId} />
                            </Col>
                            <Col className='col-12 col-sm-5'>
                                <h3>Export</h3>
                                {
                                    downloadFormats.map(downloadFormat => {
                                        return (
                                            <Row key={downloadFormat.title}>
                                                <Col className='col-6'>
                                                    <p className='my-1 ml-2'>{downloadFormat.title}:</p>
                                                </Col>
                                                <Col className='col-6'>
                                                    <div className='my-1'>
                                                        {
                                                            downloadFormat.formats.map(format => {
                                                                return (
                                                                    <a key={`${downloadFormat.title}_${format}`} className='mx-1' href={`${urlRoot}/blastdbs/${databaseId}/export?export_format=${downloadFormat.export_format}&format=${format}`} target='_blank' rel='noreferrer'>{format}</a>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                        </Row>
                    </Container>
                    <DbTable id={databaseId} sequenceCount={sequenceCount} />
                </div>
            </Layout>
        </Wrapper>
    )
}

export default BlastDb