const handleResponse = (setRefetchInterval) => (response) => {
    if (response.ok) {
        return response.json();
    } else {
        // disable refetches if errored once
        if (typeof setRefetchInterval !== 'undefined') {
            setRefetchInterval(false)
        }
        console.log(response.json())
        throw new Error(`${response.status}: ${response.statusText}`);
    }
};

const ErrorMessage = ({error, text = 'Encountered an error fetching the status of this run.'}) => {
    return (
        <div>
            <h2>Error {error.message}</h2>
            <strong>{text}</strong>
            <p>Please try again. If the error persists, contact the site adminstrator.</p>
        </div>
    )
};

export { ErrorMessage, handleResponse }