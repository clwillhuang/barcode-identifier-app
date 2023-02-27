import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import CustomHelmet from '../components/custom-helmet';
import Wrapper from '../components/wrapper';
import { docsRoot } from '../url';

const ApiDocs = () => {
    return (
        <Wrapper>
            <CustomHelmet
                title='API Documentation'
                description='View interactive API documentation for the Barcode Identifier API.'
                canonical='api-docs'
            />
            <h2>Interactive API Documentation</h2>
            <SwaggerUI url={`${docsRoot}/swagger.yaml`} />
        </Wrapper>
    );
}

export default ApiDocs;
