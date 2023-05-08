import styles from './workflow.module.css'
import { FaPaperPlane, FaServer, FaFileAlt, FaChevronRight, FaDocker, FaDatabase, FaLink, FaChevronDown} from 'react-icons/fa'
import React, { useState } from 'react';

function Workflow() {

    // 0 = query database, 1 = curate
    const [useCase, setUseCase] = useState(0);

    const hostWorkflow = [
        {
            title: 'Setup',
            desc: 'Use our Docker images to setup the server software on any local or remote machine supporting Docker.',
            icon: FaDocker,
        },
        {
            title: 'Curate',
            desc: 'Add databases to your website by pulling directly data from GenBank by their accession numbers.',
            icon: FaDatabase,
        },
        {
            title: 'Share',
            desc: 'Share the link with users of your site so they can find it.',
            icon: FaLink,
        }
    ]

    const queryWorkflow = [
        {
            title: 'Query Submission',
            desc: 'Gather your query sequences in a .fasta file or by pasting into the website. Specify your run parameters and submit.',
            icon: FaPaperPlane
        },
        {
            title: 'Processing',
            desc: 'Wait for your job to finish running on a remote server, as your  sequences are systematically compared against barcodes in the database.',
            icon: FaServer
        },
        {
            title: 'Results Report',
            desc: 'View your results as a BLAST report and a phylogenetic tree or directly download the output files.',
            icon: FaFileAlt
        }
    ]

    const renderWorkflow = (workflowData) =>
        <div className={styles.gridContainer}>
            <div className={styles.workflowGrid}>
                {
                    workflowData.map((info, index) =>
                        <React.Fragment key={info.title}>
                            <div className={styles.workflowStep} key={info.title}>
                                <info.icon size={60}/>
                                <h3>{info.title}</h3>
                                <p>{info.desc}</p>
                            </div>
                            {index < queryWorkflow.length - 1 &&
                                <FaChevronRight className={styles.visibleOnWide} size={30} />}
                            {index < queryWorkflow.length - 1 &&
                                <FaChevronDown className={styles.visibleOnNarrow} size={30} />}
                        </React.Fragment>
                    )
                }
            </div>
        </div>


    return (
        <div className={styles.workflow} id='workflow'>
            <h2>Computational tools for highly specialized barcode databases.</h2>
            <p>We provide researchers with user-friendly tools to access barcode reference libraries or host their own.</p>
            <div className={styles.workflowOptions}>
                <div className={styles.controls}>
                <p className={styles.prompt}>I want to ...</p>
                {
                    ['query a reference library.', 'host a reference library.'].map((text, index) =>
                        <button className={useCase === index ? styles.selected : ''} onClick={() => setUseCase(index)}>{text}</button>)
                }
                </div>
                {useCase === 0 && renderWorkflow(queryWorkflow)}
                {useCase === 1 && renderWorkflow(hostWorkflow)}
            </div>
        </div>
    )
}

export default Workflow;