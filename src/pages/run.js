import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';
import './run.css'

const Run = () => {

    let { runId } = useParams();
    let [run, setRun] = useState(undefined)

    // TODO: Handle bad requests / responses
    useEffect(() => {
        fetch(`${urlRoot}/runs/${runId}`)
            .then((response) => response.json())
            .then((data) => {
                setRun(data)
            })
            .catch((e) => console.log(e))
    }, [runId])

    const makeTable = (hits) => {
        var headers = [];
        if (hits.length === 0) {
            return(<p>No hits were found with this query.</p>)
        }
        // TODO: Omit some of the keys (e.g. sequence_start --> Sequence Start) 
        // TODO: Tidy up the displayed header names (e.g. sequence_start --> Sequence Start)
        // TODO: Tidy up the display of decimal numbers (e.g. 0.00003000000 --> scientific notation) 
        for(var key in hits[0]){
            headers.push(key);
        }
        return(
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {headers.map(head => <th key={`head${head}`}>{head}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {hits.map((hit, row) => 
                        <tr key={`row${row}`}>
                            {
                                headers.map((head, index) => <td key={`${head}${index}`}>{hit[head]}</td>)
                            }
                        </tr>)}
                </tbody>
            </Table>
        )
    }

    return (
        <Wrapper>
            {typeof run === 'undefined' && <div>Retrieving run data ... </div>}
            {typeof run !== 'undefined' &&
                <div>
                    <h1>Blast Run Viewer</h1>
                    <h3>Run Parameters</h3>
                    <p>Unique Run Identifier:</p><pre>{runId}</pre>
                    <p>User-specified job name:</p><pre>{run.job_name}</pre>
                    <p>Database used:<Link to={`/database/${run.db_used.id}`}>{run.db_used.custom_name}</Link></p>
                    <p>Query sequence:</p>
                    <pre>{run.query_sequence}</pre>
                    <h3>Run Results</h3>
                    {makeTable(run.hits)}
                </div>
            }
        </Wrapper>
    )
}

export default Run