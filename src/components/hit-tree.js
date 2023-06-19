import { Button, Col, Container, FormGroup, FormSelect, Row } from 'react-bootstrap';
import 'phylotree/dist/phylotree.css'
import React, { useState } from 'react'
import { runsFolder, urlRoot } from '../url'
import styles from './hit-tree.module.css'
import { FaCloudDownloadAlt, FaFileAlt, FaMouse } from 'react-icons/fa'
import { Tree } from './Tree';

const RunTreeTab = ({ run_data, querySequences, enabled }) => {
    const HIT_TREE = 0, DB_TREE = 1

    const [treeSelected, setTreeSelected] = useState({
        tree: run_data.create_hit_tree ? run_data.hit_tree : run_data.db_tree,
        id: run_data.create_hit_tree ? run_data.alignment_job_id : run_data.complete_alignment_job_id
    })

    const downloadAlignment = () => {
        if (typeof window !== 'undefined') {
            window.open(`${urlRoot}/${runsFolder}/${run_data.id}/${treeSelected.id}.aln-clustal_num.clustal_num`)
        }
    }

    const downloadSequences = () => {
        if (typeof window !== 'undefined') {
            window.open(`${urlRoot}/${runsFolder}/${run_data.id}/${treeSelected.id}.sequence.txt`)
        }
    }

    const downloadTree = () => {
        if (typeof window !== 'undefined') {
            window.open(`${urlRoot}/${runsFolder}/${run_data.id}/${treeSelected.id}.phylotree.ph`)
        }
    }

    const copyTreeToClipboard = () => {
        if (typeof navigator !== 'undefined' && run_data) {
            navigator.clipboard.writeText(treeSelected.tree);
            window.document.querySelector('#copyNotif').style.visibility = 'visible';
            setTimeout(() => {
                window.document.querySelector('#copyNotif').style.visibility = 'hidden';
            }, 1000)
        }
    }

    const handleTreeSelect = (event) => {
        const newTreeSelected = parseInt(event.target.value)
        let newData = { ...treeSelected }
        if (newTreeSelected === HIT_TREE) {
            newData.tree = run_data.hit_tree;
            newData.id = run_data.alignment_job_id;
        } else if (newTreeSelected === DB_TREE) {
            newData.tree = run_data.db_tree;
            newData.id = run_data.complete_alignment_job_id;
        }
        setTreeSelected(newData)
    }

    return (
        <div>
            <h3>Phylogenetic tree of hits and query sequences</h3>
            <p>Multiple sequence alignment by Clustal Omega at EBML-EBI</p>
            <Container>
                <Row className='pb-3'>
                    <p>Show</p>
                    <FormGroup className={styles.treeSelect}>
                        <FormSelect onChange={handleTreeSelect}>
                            {run_data.create_hit_tree && <option value={HIT_TREE}>Tree with query and hit sequences only</option>}
                            {run_data.create_db_tree && <option value={DB_TREE}>Tree with query and all database sequences</option>}
                        </FormSelect>
                    </FormGroup>
                </Row>
                <Row>
                    <div className='text-muted'>
                        <span><FaMouse /> Click and drag to pan. Scroll to zoom.</span>
                    </div>
                </Row>
                <Tree {...treeSelected} querySequences={querySequences} enabled={enabled}/>
                <Row className='mt-3'>
                    <strong className={styles.subtitle}>Job ID</strong>
                    <p>{treeSelected.id}</p>
                </Row>
                <Row>
                    <Col className='col-auto'>
                        <Button variant='primary' className='align-middle text-white text-decoration-none mx-0' onClick={downloadAlignment}>
                            <FaCloudDownloadAlt className={styles.buttonIcon} />
                            Download MSA
                        </Button>
                    </Col>
                    <Col className='col-auto'>
                        <Button variant='primary' className='align-middle text-white text-decoration-none' onClick={downloadTree}>
                            <FaCloudDownloadAlt className={styles.buttonIcon} />
                            Download tree
                        </Button>
                    </Col>
                    <Col className='col-auto'>
                        <Button variant='primary' className='align-middle text-white text-decoration-none' onClick={downloadSequences}>
                            <FaCloudDownloadAlt className={styles.buttonIcon} />
                            Download sequences
                        </Button>
                    </Col>
                </Row>
                <Row className='mt-3'>
                    <strong className={styles.subtitle}>Raw Newick</strong>
                </Row>
                <Row className='d-flex align-items-center'>
                    <Col className='col-auto'>
                        <Button id='treeCopy' variant='primary' className='align-middle text-white text-decoration-none' onClick={copyTreeToClipboard}>
                            <FaFileAlt className={styles.buttonIcon} />
                            Copy to clipboard
                        </Button>
                    </Col>
                    <Col>
                        <span id='copyNotif' style={{ visibility: 'hidden' }} className='text-success'>Copied!</span>
                    </Col>
                </Row>
                <details>
                    <summary>Show entire raw string</summary>
                    <p><code>{treeSelected.tree}</code></p>
                </details>
            </Container>
        </div>
    )
}

export default RunTreeTab
