import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import CustomHelmet from '../components/custom-helmet';
import Wrapper from '../components/wrapper';
import Layout from '../components/layout';
import { swaggerRoot } from '../url';

const ApiDocs = () => {
    return (
        <Wrapper>
            <CustomHelmet
                title='API Documentation'
                description='View interactive API documentation for the Barrel API.'
                canonical='api-docs'
            />
            <Layout>
                <h2>Interactive API Documentation</h2>
                <SwaggerUI defaultModelsExpandDepth={-1} url={`${swaggerRoot}/swagger.yaml`} />
            </Layout>
        </Wrapper>
    );
}

export default ApiDocs;
