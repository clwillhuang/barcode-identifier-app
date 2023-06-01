import React from 'react'
import { Accordion, Breadcrumb, BreadcrumbItem, Spinner } from 'react-bootstrap';

import { useParams, useNavigate } from 'react-router-dom'
import Wrapper from '../components/wrapper'
import Layout from '../components/layout'
import { generateHeaders, urlRoot } from '../url';
import { useQuery } from 'react-query'
import styles from './run.module.css'
import { ErrorMessage, handleResponse } from '../components/error-message';
import CustomHelmet from '../components/custom-helmet';

const RunStatus = () => {
    let navigate = useNavigate()
    const [willRedirect, setRedirect] = React.useState(false)
    const [refetchInterval, setRefetchInterval] = React.useState(2000)

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
    const redirectDelayInSeconds = 2;

    const { isLoading, error, data: status, dataUpdatedAt, errorUpdatedAt, isError, isSuccess} = useQuery([`blast_poll_${runId}`], () =>
        fetch(`${runUrl}/status`, {
            headers: generateHeaders({})
        })
        .then(handleResponse(setRefetchInterval)), 
        {
            refetchInterval: (data) => {
                if (refetchInterval) {
                    if (!data) return refetchInterval;
                    let stopFetches = [FINISHED_STATUS, DENIED_STATUS, ERRORED_STATUS].includes(data.status)
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
            <Layout>
                {helmet}
                <p>Retrieving run status ...</p>
            </Layout>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <Layout>
                {helmet}
                <h1>Run status update</h1>
                <ErrorMessage error={error} text={`Encountered an error fetching the status of run ${runId}. Please try again.`}/>
            </Layout>
        </Wrapper>
    )
        

    const started = status.status === STARTED_STATUS
    const queued = status.status === QUEUED_STATUS
    const denied = status.status === DENIED_STATUS
    const resolved = status.status === ERRORED_STATUS || status.status === FINISHED_STATUS 
    const lastFetchDate = isError ? new Date(errorUpdatedAt) : isSuccess ? new Date(dataUpdatedAt) : null

    function getRedirectUrl() {
        return `/run/${status.id}/results`;
    }

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
                    ({status_string}) The job is currently running.
                    <Spinner animation="border" role="status"></Spinner>
                </p>
            )
        } else if (status_string === FINISHED_STATUS) {
            return(
                <div>
                    <p className='d-inline-flex align-items-center text-success'>
                        ({status_string}) The job has completed processing. You will be redirected shortly.
                        <Spinner className='mx-2' animation="border" role="status"></Spinner>
                    </p>
                    <p>If you are not directed after {redirectDelayInSeconds} second(s), <a href={getRedirectUrl()}>view results by clicking here.</a></p>
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
        setTimeout(() => {
            navigate(getRedirectUrl())
        }, redirectDelayInSeconds * 1000)
        setRedirect(true)
    }
    
    return (
        <Wrapper>
            {helmet}
            <Layout>
                <Breadcrumb>
                    <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                    <BreadcrumbItem href='/blast'>Run</BreadcrumbItem>
                    <BreadcrumbItem active>Status</BreadcrumbItem>
                </Breadcrumb>
                <div className={styles.parameters}>
                    <h1>Run status update</h1>
                    <h3>Status</h3>
                    <p>{getStatus(status.status)}</p>
                    <p className='text-muted'>Last updated: {lastFetchDate ? dateFormatter.format(lastFetchDate) : 'Never'}</p>
                    <strong>Job name</strong><pre>{status.job_name !== '' ? status.job_name : 'No job name given'}</pre>
                    <strong>Run Identifier</strong><pre>{runId}</pre>
                    <Accordion>
                        <Accordion.Item eventKey='0'>
                            <Accordion.Header>View server log</Accordion.Header>
                            <Accordion.Body>
                                <p>The server received this job and added it to the queue at {dateFormatter.format(Date.parse(status.received_time))} ({getTimeSince(new Date(status.received_time))})</p>
                                {status.start_time &&
                                    <p>The server began running this job at {dateFormatter.format(Date.parse(status.start_time))} ({getTimeSince(new Date(status.start_time))})</p>}
                                {status.end_time &&
                                    <p>The server completed running this job at {dateFormatter.format(Date.parse(status.end_time))} ({getTimeSince(new Date(status.end_time))})</p>}
                                <p></p>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Layout>
        </Wrapper>
    )
}

export default RunStatus


