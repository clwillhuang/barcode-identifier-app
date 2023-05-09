import React from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from '../pages/blastdb.module.css'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const BlastDbPreview = ({ database }) => {

    const { id, custom_name, sequences, description, owner: {username} } = database

    return (
        <ListGroupItem className="d-flex flex-column justify-content-between align-items-start">
            <Link to={`/databases/${id}`}><h3>{custom_name}</h3></Link>
            <p>{description}</p>
            <p className='text-muted fst-italic my-0'>Contains {sequences.length} nucleotide sequences</p>
            <div className={styles.visibilityInfo}>
                <p className='mt-0 mb-2 text-muted'>
                {
                    database.public ? 
                    <><FaRegEye />Public Database</> 
                    : 
                    <><FaRegEyeSlash/> Private Database</>
                }
                </p>
                <p className='mt-0 mb-2 text-muted'>
                <span className='mx-2'>|</span>
                Adminstered by <a>{username}</a>
                </p>
            </div>
            <div className='d-inline'>
                <Button variant='primary' className='align-middle'>
                    <Link to={`/blast/?database=${id}`} className='text-white text-decoration-none'>Run a Query</Link>
                </Button>
                <Link to={`/databases/${id}`} className='mx-4 align-middle'>Browse entries</Link>
            </div>

        </ListGroupItem>
    )
}

export default BlastDbPreview