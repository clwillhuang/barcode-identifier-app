import React, { useMemo } from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BlastDbPreview = ({ database, libraryId }) => {

    const { id, version_number, sequence_count, description, created, locked } = database
    
    const dateFormatter = useMemo(() => {
        return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', 
        timeZoneName: 'short', hour12: false,
    })}, [])

    return (
        <ListGroupItem className="d-flex flex-column justify-content-between align-items-start">
            <Link to={`/libraries/${libraryId}/version/${id}`}><h3>Version {version_number}</h3></Link>
            <p>{description}</p>
            <p className='text-muted fst-italic my-0'>Contains {sequence_count} nucleotide sequences</p>
            <p>{locked ? 'Published' : 'Not published yet'}</p>
            <p>Last updated at {dateFormatter.format(created)}</p>
            <div className='d-inline'>
                <Button variant='primary' className='align-middle'>
                    <Link to={`/blast/?database=${id}`} className='text-white text-decoration-none'>Run a Query</Link>
                </Button>
                <Link to={`/libraries/${libraryId}/version/${id}`} className='mx-4 align-middle'>Browse entries</Link>
            </div>
        </ListGroupItem>
    )
}

export default BlastDbPreview