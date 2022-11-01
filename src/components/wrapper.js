import React from 'react'
import { Container } from 'react-bootstrap'
import styles from './wrapper.module.css'

export default function Wrapper({children}) {
    return(
        <Container>
            <div className={styles.wrapperDiv}>
                {children}
            </div>
        </Container>
    )
}