import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './library-preview.module.css'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'


const LibraryPreview = ({ library }) => {

    const { id, custom_name, description, public: is_public_library, owner: {username} } = library

    return (
        <ListGroupItem className="d-flex flex-column justify-content-between align-items-start">
            <Link to={`/libraries/${id}`}><h3>{custom_name}</h3></Link>
            <p>{description}</p>
            <div className={styles.visibilityInfo}>
                <p className='mt-0 mb-2 text-muted'>
                {
                    is_public_library ? 
                    <><FaRegEye/> Public Database</> 
                    : 
                    <><FaRegEyeSlash/> Private Database</>
                }
                </p>
                <p className='mt-0 mb-2 text-muted'>
                <span className='mx-2'>|</span>
                Adminstered by <a>{username}</a>
                </p>
            </div>
        </ListGroupItem>
    )
}

export default LibraryPreview