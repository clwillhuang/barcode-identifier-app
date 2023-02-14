import React from 'react'
import { Accordion, Breadcrumb, BreadcrumbItem, Spinner } from 'react-bootstrap';

import { useParams, useNavigate } from 'react-router-dom'
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';
import { useQuery } from 'react-query'
import styles from './run.module.css'
import { ErrorMessage, handleResponse } from '../components/error-message';
import CustomHelmet from '../components/custom-helmet';

const RunStatus = () => {
    let navigate = useNavigate()
    const [willRedirect, setRedirect] = React.useState(false)
    const [refetchInterval, setRefetchInterval] = React.useState(5000)

    const { runId } = useParams();
    const DENIED_STATUS = 'DEN'
    const QUEUED_STATUS = 'QUE'
    const FINISHED_STATUS = 'FIN'
    const STARTED_STATUS = 'STA'
    const ERRORED_STATUS = 'ERR'
    const runUrl = `${urlRoot}/runs/${runId}`
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric', 
        timeZoneName: 'short', hour12: false,
    })

    function redirect() {
        navigate(`/run/${status.id}/results`);
    }

    const { isLoading, error, data: status, dataUpdatedAt, errorUpdatedAt, isError, isSuccess} = useQuery([`blast_poll_${runId}`], () =>
        fetch(`${runUrl}/status`).then(handleResponse(setRefetchInterval)), 
        {
            refetchInterval: (data) => {
                if (refetchInterval) {
                    if (!data) return refetchInterval;
                    let stopFetches = [FINISHED_STATUS, DENIED_STATUS, ERRORED_STATUS].includes(data.job_status)
                    if (stopFetches) {
                        setRefetchInterval(false);
                    } 
                    return stopFetches ? false : refetchInterval;
                } else {
                    return false;
                }
            },
            refetchOnWindowFocus: false,
            retry: false,
        }
    )

    const helmet = <CustomHelmet
		title='Run results'
		description='Get the results of your query on a curated reference library of Neotropical electric fish sequences.'
		canonical='run'
	/>

    if (isLoading) return (
        <Wrapper>
            {helmet}
            <p>Retrieving run status ...</p>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            {helmet}
            <h1>Run status update</h1>
            <ErrorMessage error={error} text={`Encountered an error fetching the status of run ${runId}. Please try again.`}/>
        </Wrapper>
    )
        

    const started = status.job_status === STARTED_STATUS
    const queued = status.job_status === QUEUED_STATUS
    const denied = status.job_status === DENIED_STATUS
    const resolved = status.job_status === ERRORED_STATUS || status.job_status === FINISHED_STATUS 
    const lastFetchDate = isError ? new Date(errorUpdatedAt) : isSuccess ? new Date(dataUpdatedAt) : null

    const getStatus = (status_string) => {
        if (status_string === DENIED_STATUS) {
            return(
                <p className='text-danger'>
                    ({status_string}) The job was denied by the server and will not be run. 
                </p>
            )
        } else if (status_string === QUEUED_STATUS) {
            return(
                <p className='d-inline-flex align-items-center text-dark'>
                    ({status_string}) The job is currently queued for processing.
                    <Spinner animation="border" role="status"></Spinner>
                </p>
            )
        } else if (status_string === STARTED_STATUS) {
            return(
                <p className='d-inline-flex align-items-center text-warning'>
                    ({status_string}) The job has passed through the queue and is currently being processed.
                    <Spinner animation="border" role="status"></Spinner>
                </p>
            )
        } else if (status_string === FINISHED_STATUS) {
            return(
                <div>
                    <p className='d-inline-flex align-items-center text-success'>
                        ({status_string}) The job has completed processing. You will be redirected shortly.
                        <Spinner animation="border" role="status"></Spinner>
                    </p>
                </div>
            )
        } else if (status_string === ERRORED_STATUS) {
            return(
                <p className='text-danger'>
                    ({status_string}) The job has encountered an unexpected error and could not proceed.
                </p>
            )
        } else {
            return(
                <p className='text-info'>
                    ({status_string}) The status of the job is unknown. Please contact site adminstrator.
                </p>
            )
        }
    }

    const getTimeSince = (date) => {
        const formatter = new Intl.RelativeTimeFormat('en');
        const ranges = {
            months: 3600 * 24 * 30,
            weeks: 3600 * 24 * 7,
            days: 3600 * 24,
            hours: 3600,
            minutes: 60,
            seconds: 1
        };
        const secondsElapsed = (date.getTime() - Date.now()) / 1000;
        for (let key in ranges) {
            if (ranges[key] < Math.abs(secondsElapsed)) {
                const delta = secondsElapsed / ranges[key];
                return formatter.format(Math.round(delta), key);
            }
        }
    }

    if (!willRedirect && resolved) {
        setTimeout(redirect, 5000)
        setRedirect(true)
    }
    
    return (
        <Wrapper>
            {helmet}
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem href='/blast'>Run</BreadcrumbItem>
                <BreadcrumbItem active>Status</BreadcrumbItem>
            </Breadcrumb>
            <div className={styles.parameters}>
                <h1>Run status update</h1>
                <h3>Status</h3>
                <p>{getStatus(status.job_status)}</p>
                <p className='text-muted'>Last updated: {lastFetchDate ? dateFormatter.format(lastFetchDate) : 'Never'}</p>
                <strong>Job name</strong><pre>{status.job_name}</pre>
                <strong>Run Identifier</strong><pre>{runId}</pre>

                <Accordion>
                    <Accordion.Item eventKey='0'>
                        <Accordion.Header>View server log</Accordion.Header>
                        <Accordion.Body>
                            <p>The server received this job and added it to the queue at {dateFormatter.format(Date.parse(status.runtime))} ({getTimeSince(new Date(status.runtime))})</p>
                            {status.job_start_time &&
                                <p>The server began running this job at {dateFormatter.format(Date.parse(status.job_start_time))} ({getTimeSince(new Date(status.job_start_time))})</p>}
                            {status.job_end_time &&
                                <p>The server completed running this job at {dateFormatter.format(Date.parse(status.job_end_time))} ({getTimeSince(new Date(status.job_end_time))})</p>}
                            <p></p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </Wrapper>
    )
}

export default RunStatus