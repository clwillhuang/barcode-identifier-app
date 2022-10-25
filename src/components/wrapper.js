import React from 'react'
import styles from './wrapper.module.css'

export default function Wrapper({children}) {
    return(
    <div className={styles.wrapperDiv}>
        {children}
    </div>)
}