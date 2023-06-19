import React, { useCallback, useMemo } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { ErrorMessage, handleResponse } from '../components/error-message';
import { generateHeaders, urlRoot } from '../url';
import { FaExternalLinkAlt } from 'react-icons/fa'
import styles from './sequence-popup.module.css'

const SequencePopup = ({ nuccoreId, setSequenceShown }) => {

    const handleClose = () => setSequenceShown(null);
    const show = nuccoreId !== null;

    const dateFormatter = useMemo(() => {
        return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', 
        timeZoneName: 'short', hour12: false,
    })}, [])

    const { isLoading, error, data, isError } = useQuery([`nuccore_${nuccoreId}`], () =>
        fetch(`${urlRoot}/nuccores/${nuccoreId}`, {
            mode: 'cors',
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
            enabled: (show && nuccoreId !== null),
        }
    )

    const toTitleCase = useCallback((str) => {
        str = str.replace('_', ' ')
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }, [])

    if (isLoading) {
        return (
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Body>Loading ...</Modal.Body>
            </Modal>
        )
    }

    if (isError) {
        return (
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Body>Encountered an unexpected error.</Modal.Body>
                <ErrorMessage error={error}/>
            </Modal>
        )
    }

    if (!data) {
        return (
            <></>
        )
    }

    const taxa = ['Superkingdom', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']
    const taxonomic_data = taxa.map(name => {
        let key = `taxon_${name.toLowerCase()}`
        let d = data[key]
        if (typeof d === 'undefined' || d === null) {
            return <div key={name}>
                <span>{name}: </span>
                <p>Unknown</p>
            </div>
        } else {
            return (
                <div key={name}>
                    <span>{name}: </span>
                    <a target='_blank' rel='noreferrer' href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${d.id}`}>
                        {d.scientific_name} <FaExternalLinkAlt />
                    </a>
                </div>
            )
        }
    })

    const annotations = data.annotations.map((annotation, index) => {
        const { poster: { username }, timestamp, annotation_type, comment } = annotation
        return (
            <div key={index}>
                <b>{annotation_type}</b><br />
                <em>Posted by {username} at {dateFormatter.format(new Date(timestamp))}</em>
                <p>{comment}</p>
            </div>
        )
    })

    const layout = [
        {
            title: 'Summary',
            fields: [['version', 'Accession.Version'], 'organism', ['created', 'Date Added'], 'genbank_modification_date', 'organelle', 'type_material', 'definition', 'isolate']
        },
        {
            title: 'Collection Information',
            fields: ['country', ['lat_lon', 'Latitude, Longitude'], 'specimen_voucher']
        },
        {
            title: 'Publication Info',
            fields: ['journal', 'title', 'authors']
        }
    ]

    return (
        <Modal show={show} onHide={handleClose} animation={false} style={{maxWidth: '100vw'}}>
            <Modal.Header closeButton>
                <Modal.Title>{data['version']}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    layout.map(category => {
                        return (
                            <React.Fragment key={category.title}>
                                <h2>{category.title}</h2>
                                <div className={styles.grid}>
                                    {
                                        category.fields.map(field => {
                                            let displayName = Array.isArray(field) ? field[1] : toTitleCase(field)
                                            let keyName = Array.isArray(field) ? field[0] : field
                                            if (keyName === 'lat_lon') {
                                                return (
                                                    <React.Fragment key={field}>
                                                        <b key={field}>{displayName}</b>
                                                        <a className='text-nowrap' target='_blank' rel='noreferrer' href={`http://maps.google.com/maps?q=${data[keyName]}`}>
                                                            <code>{data[keyName]} </code>
                                                            <FaExternalLinkAlt />
                                                        </a>
                                                    </React.Fragment>
                                                )
                                            }
                                            if (keyName === 'created') data[keyName] = dateFormatter.format(new Date(data[keyName]))
                                            return (
                                                <React.Fragment key={field}>
                                                    <b>{displayName}</b>
                                                    <p>{data[keyName].length > 0 ? data[keyName] : '-'}</p>
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </div>
                            </React.Fragment>
                        )
                    })
                }
                <h2>Taxonomy</h2>
                <div className={styles.grid}>
                    {taxonomic_data}
                </div>
                <h2>User Annotations</h2>
                {annotations.length === 0 ? 'No annotations' : annotations}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )

}

export default SequencePopup;