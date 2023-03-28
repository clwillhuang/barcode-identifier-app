import React from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BlastDbPreview = ({ database }) => {

    const { id, custom_name, sequences, description } = database

    return (
        <ListGroupItem className="d-flex flex-column justify-content-between align-items-start">

            <h3>{custom_name}</h3>
            <p>{description}</p>
            <p className='text-muted fst-italic'>Contains {sequences.length} nucleotide sequences</p>

            <div className='d-inline'>
                <Button variant='primary' className='align-middle'>
                    <Link to={`/blast/?database=${database.id}`} className='text-white text-decoration-none'>Run a Query</Link>
                </Button>
                <Link to={`/database/${id}`} className='mx-4 align-middle'>Browse entries</Link>
            </div>

        </ListGroupItem>
    )
}

export default BlastDbPreview