import { Alert, Breadcrumb, BreadcrumbItem, ListGroup } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import BlastDbPreview from '../components/blastdb-preview';
import CustomHelmet from '../components/custom-helmet';
import { ErrorMessage, handleResponse } from '../components/error-message';
import Layout from '../components/layout';
import Wrapper from '../components/wrapper';
import { generateHeaders, urlRoot } from '../url';
import styles from './library.module.css'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import VersionTable from '../components/version-table';

function Library() {
    const { libraryId } = useParams()

    const { isLoading: isLibraryLoading, error: libraryError, data: libraryData, isError: isLibraryError } = useQuery([`library_${libraryId}`], () =>
        fetch(`${urlRoot}/libraries/${libraryId}`, {
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const { isLoading: isVersionLoading, error: versionError, data: versions, isError: isVersionError } = useQuery([`versions_${libraryId}`], () =>
        fetch(`${urlRoot}/libraries/${libraryId}/versions`, {
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const isLoading = isLibraryLoading || isVersionLoading
    const isError = isLibraryError || isVersionError
    const error = libraryError ?? versionError

    console.log(versions)

    if (isLoading) return (
        <Wrapper>
            <Layout>
                <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                <p>Retrieving data ...</p>
            </Layout>
        </Wrapper>
    )

    if (isError) return (
        <Wrapper>
            <Layout>
                <Alert variant='secondary'>This website build is accessing data from <a href={urlRoot}>{urlRoot}</a></Alert>
                <ErrorMessage error={error} text="Could not find a reference library matching the specified details. Check the website link and please try again." />
            </Layout>
        </Wrapper>
    )

    const { id, custom_name, description, owner: { username }, public: is_public_library, latest } = libraryData

    return (
        <Wrapper>
            <CustomHelmet
                title={`${custom_name} Reference Library`}
                description={`${custom_name} maintained by ${username} | ${description}`}
                canonical=''
            />
            <Layout>
            <Breadcrumb>
                <BreadcrumbItem href='/'>Home</BreadcrumbItem>
                <BreadcrumbItem href='/libraries'>Reference Libraries</BreadcrumbItem>
                <BreadcrumbItem active>{custom_name}</BreadcrumbItem>
            </Breadcrumb>
            <div>
                <h1>"{custom_name}"</h1>
                <div className={styles.visibilityInfo}>
                    <p className='mt-0 mb-2 text-muted'>
                    {
                        is_public_library ? 
                        <><FaRegEye />Public Database</> 
                        : 
                        <><FaRegEyeSlash/> Private Database</>
                    }
                    </p>
                    <p className='mt-0 mb-2 text-muted'>
                    <span className='mx-2'>|</span>
                    Adminstered by {username}
                    </p>
                </div>
                <p>{description}</p>
                <h3>Latest Version</h3>
                {console.log(latest)}
                <BlastDbPreview database={latest} libraryId={id}/>
                <VersionTable initialData={versions} libraryId={id}/>
            </div>
            </Layout>
        </Wrapper>
    )
}

export default Library;