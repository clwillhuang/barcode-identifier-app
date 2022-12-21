const handleResponse = (setRefetchInterval) => (response) => {
    if (response.ok) {
        return response.json();
    } else {
        // disable refetches if errored once
        if (typeof setRefetchInterval !== 'undefined') {
            setRefetchInterval(false)
        }
        throw new Error(`${response.status}: ${response.statusText}`);
    }
};

const ErrorMessage = ({error}) => {
    return (
        <div>
            <h2>Error {error.message}</h2>
            <strong>Encountered an error fetching the status of this run.</strong>
            <p>Please try again. If the error persists, contact the site adminstrator.</p>
        </div>
    )
};

export { ErrorMessage, handleResponse }