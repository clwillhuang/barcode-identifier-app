import React from 'react'
import { Container } from 'react-bootstrap'

export default function Wrapper({children}) {
    return(
        <Container>
            <div className="className='col-12 col-md-9 mx-auto py-4">
                {children}
            </div>
        </Container>
    )
}