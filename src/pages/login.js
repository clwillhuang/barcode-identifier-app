import { useState } from 'react';
import { Alert, Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import CustomHelmet from '../components/custom-helmet';
import Layout from '../components/layout';
import { urlRoot, appName } from '../url';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Wrapper from '../components/wrapper';

function Login() {

    const navigate = useNavigate();
    let [responseError, setResponseError] = useState(null);

    const helmet = <CustomHelmet
        title='Sign in'
        description={`Sign into ${appName}`}
        canonical=''
    />

    const csrftoken = Cookies.get('csrftoken');;

    const handleSubmit = (event) => {

        event.preventDefault()

        const form_info = document.getElementById('loginForm')
        let formData = new FormData(form_info)
        let postHeaders = {
            'X-CSRFToken': csrftoken
        }

        fetch(`${urlRoot}/login/`, {
            method: 'POST',
            headers: postHeaders,
            mode: 'cors',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error()
                }
            })
            .then(data => {
                Cookies.set('knox', data.token, {
                    expires: new Date(data.expiry), 
                    sameSite: "strict", 
                    path: '/'
                }
                )
                navigate('/libraries')
            })
            .catch(error => {
                setResponseError('Unable to log in with the credentials provided.')
            })
    }

    return (
        <Wrapper>
            <Layout>
                {helmet}
                <h2>Login</h2>
                {
                    responseError &&
                    <Alert variant='danger'>
                        <Alert.Heading>Login failed</Alert.Heading>
                        {responseError}
                    </Alert>
                }
                <Form id='loginForm' onSubmit={handleSubmit}>
                    <FormGroup className='my-3 mx-5'>
                        <FormLabel htmlFor='username'>Username</FormLabel>
                        <FormControl id='username' name='username' as='input' placeholder=''></FormControl>
                    </FormGroup>
                    <FormGroup className='my-3 mx-5'>
                        <FormLabel htmlFor='password'>Password</FormLabel>
                        <FormControl id='password' name='password' as='input' placeholder='' type='password'></FormControl>
                    </FormGroup>
                    <Button type='submit'>Login</Button>
                </Form>
            </Layout>
        </Wrapper>
    )
}

export default Login;
