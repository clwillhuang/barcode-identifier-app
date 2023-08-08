import React, { useMemo } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './blastdb-preview.module.css'

const BlastDbPreview = ({ database, libraryId }) => {
    const dateFormatter = useMemo(() => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            timeZoneName: 'short', hour12: false,
        })
    }, [])

    if (database === null) {
        return (
            <div className={styles.container}>
                <span>This reference library does not have any database versions published yet for queries.</span>
            </div>
        )
    }

    const { id, version_number, custom_name, sequence_count, description, created, locked } = database

    return (
        <div className={styles.container}>
            <Link to={`/libraries/${libraryId}/version/${id}`}><h3>Version {version_number} {custom_name ? `("${custom_name}")` : ''}</h3></Link>
            <p className={styles.description}>{description}</p>
            <p className={styles.sequenceCount}>Contains {sequence_count} nucleotide sequences. Last updated at {dateFormatter.format(new Date(created))}</p>
            <div className={styles.buttonRow}>
                {
                    locked ? 
                    <Link to={`/blast/?database=${id}`} className='text-white text-decoration-none'>
                        <Button variant='primary'>
                            Run a Query
                        </Button>
                    </Link>
                    :
                    <span> Not published. </span>
                }
                <Link to={`/libraries/${libraryId}/version/${id}`} className='mx-4 align-middle'>Browse entries</Link>
            </div>
        </div>
    )
}

export default BlastDbPreview