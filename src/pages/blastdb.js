import React from 'react'
import { Breadcrumb, BreadcrumbItem, Button, Col, Container, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import DbTable from '../components/db-table';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

const BlastDb = () => {

    const { databaseId } = useParams();

    const { isLoading, error, data } = useQuery([`blastdb_${databaseId}`], () => 
        fetch(`${urlRoot}/blastdbs/${databaseId}`)
        .then((response) => response.json()),
        {
            refetchInterval: false,
        }
    )

    const downloadFile = (format) => {
        const types = {'text/csv': 'csv', 'text/plain': 'fasta'}

        if (typeof window === 'undefined') {
            console.error("Cannot download CSV file with window undefined.")
            return
        } else if (!(['text/csv', 'text/plain'].includes(format))) {
            console.error(`The format ${format} is not available for export.`)
            return
        }
        
        const fetchHeaders = new Headers()
        fetchHeaders.append('Accept', format)

        fetch(`${urlRoot}/blastdbs/${databaseId}`, {
            method: `GET`,
            headers: fetchHeaders
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob])
                )
                const link = document.createElement('a', )
                link.href = url 
                link.setAttribute('download', `results.${types[format]}`) 
                document.body.appendChild(link)
                link.click()
                link.parentNode.removeChild(link)
            })
    }

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

                <Container className='g-0 mb-2'>
                    <Row className='d-flex align-items-center'>
                        <Col className='col-auto'>
                            <Button variant='primary' className='align-middle'>
                                <Link to={`/blast/?database=${data.id}`} className='text-white text-decoration-none'>Run a Query</Link>
                            </Button>
                        </Col>
                    </Row>
                </Container>

                <h3>Description</h3>
                <p>{data.description}</p>
                
                <h3>Database entries</h3>
                <p className='text-muted'>This database contains {data.sequences.length} entries.</p>
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
                            <Button variant='primary' className='align-middle text-white text-decoration-none' onClick={() => downloadFile('text/plain')}>
                                .fasta
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Wrapper>
    )
}

export default BlastDb