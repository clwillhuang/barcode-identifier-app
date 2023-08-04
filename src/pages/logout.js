import { useEffect } from 'react';
import { useQuery } from 'react-query';
import CustomHelmet from '../components/custom-helmet';
import Wrapper from '../components/wrapper';
import { generateHeaders, hasSignInCookie, urlRoot } from '../url';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import { csrftoken } from '../getCSRFToken';

const Logout = () => {

    const navigate = useNavigate();

    const helmet = <CustomHelmet
        title='Logout'
        description={`Log out of account.`}
        canonical=''
    />

    const { isLoading, isError } = useQuery(['logout'], () =>
        fetch(`${urlRoot}/users/`, {
            mode: 'cors',
            headers: generateHeaders({})
        })
            .then(response => {
                if (response.ok) {
                    console.log("verified login")
                    return response.json();
                } else {
                    throw new Error()
                }
            })
            .then(data => {

            }).catch(err => {
                console.log(err)
                console.log("Outer error");
            }),
        {
            refetchInterval: false,
            retry: false,
            enabled: hasSignInCookie()
        }
    )

    useEffect(() => {
        if (!hasSignInCookie()) {
            setTimeout(() => { navigate('/') }, 500)
            return;
        }
        if (isLoading) return;
        fetch(`${urlRoot}/logout/`, {
            method: 'POST',
            headers: generateHeaders({
                'X-CSRFToken': csrftoken
            }),
            mode: 'cors'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .catch((err) => { console.log(err) })
            .finally(() => {
                Cookies.remove('knox', { sameSite: "Strict", path: '/' })
                setTimeout(() => { navigate('/') }, 500)
            })
    }, [isLoading, navigate])

    if (isLoading) {
        return (
            <Wrapper>
                {helmet}
                <Layout>
                    <h1>Attempting to log out ... </h1>
                    <p>Do not close the window until it has succeeded.</p>
                </Layout>
            </Wrapper>
        )
    } else if (isError) {
        return (
            <Wrapper>
                {helmet}
                <Layout>
                    <h1>Logout failed.</h1>
                    <p>Try again.</p>
                </Layout>
            </Wrapper>
        )
    } else {
        return (
            <Wrapper>
                {helmet}
                <Layout>
                    <h1>Logout success.</h1>
                    <p>You have been logged out.</p>
                </Layout>
            </Wrapper>
        )
    }

}

export default Logout;