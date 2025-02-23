import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import CustomHelmet from '../components/custom-helmet';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';
import { swaggerRoot } from '../url';
import Cookies from 'js-cookie';

const ApiDocs = () => {

    // Attach the CSRF token cookie to the header for every request
    const requestInterceptor = (request) => {
        if (!request.headers['X-CSRFToken'] && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method))
            request.headers['X-CSRFToken'] = Cookies.get("csrftoken");
        return request;
    }

    return (
        <Wrapper>
            <CustomHelmet
                title='API Documentation'
                description='View interactive API documentation for the Barrel API.'
                canonical='api-docs'
            />
            <Layout>
                <h2>Interactive API Documentation</h2>
                <SwaggerUI
                    defaultModelsExpandDepth={-1}
                    url={`${swaggerRoot}/swagger.yaml`}
                    requestInterceptor={requestInterceptor}
                    withCredentials={true}/>
            </Layout>
        </Wrapper>
    );
}

export default ApiDocs;
