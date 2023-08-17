import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './library-preview.module.css'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const LibraryPreview = ({ library }) => {
    const { id, custom_name, marker_gene, description, public: is_public_library, owner: { username, email }, latest } = library
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        timeZoneName: 'short', hour12: false,
    })

    return (
        <ListGroupItem className={styles.libraryItem}>
            <div className={styles.libraryItemHeader}>
                <Link to={`/libraries/${id}`}>
                    <h3>{custom_name}</h3>
                </Link>
                <p>{marker_gene} Reference Database</p>
            </div>

            <div className={styles.visibilityInfo}>
                <p className={`text-muted ${styles.mutedText}`}>
                    {
                        is_public_library ?
                            <><FaRegEye /> Public Database</>
                            :
                            <><FaRegEyeSlash /> Private Database</>
                    }
                </p>
                <p className={`text-muted ${styles.mutedText}`}>
                    <span className='mx-2'>|</span>
                    Adminstered by <a href={`mailto:${email}`}>{username}</a>
                </p>
            </div>
            <p>{description}</p>
            {
                latest ?
                    <Link to={`/libraries/${id}/version/${latest.id}`}>Latest Version: {latest.version_number} ({latest.custom_name}), last modified {formatter.format(Date.parse(latest.created))}</Link>
                    :
                    <p>No versions published yet</p>
            }
        </ListGroupItem>
    )
}

export default LibraryPreview