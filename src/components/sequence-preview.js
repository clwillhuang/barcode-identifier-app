import React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import './sequence-preview.module.css'

const SequencePreview = ({sequence}) => {

    const {accession_number, definition, organism, organelle, dna_sequence} = sequence

    return(
        <ListGroupItem className="d-flex flex-column justify-content-between align-items-start">
            <pre>{accession_number}</pre>
            <h3>{definition}</h3>
            <em>{organism}</em>
            <p>{organelle}</p>
            <pre>
                {/* <code> */}
                    {dna_sequence}
                {/* </code> */}
            </pre>
            <a href={`https://www.ncbi.nlm.nih.gov/nuccore/${accession_number}`} target='_blank' referrerPolicy='no-referrer'>Visit GenBank entry</a>
            
        </ListGroupItem>
    )
}

export default SequencePreview
