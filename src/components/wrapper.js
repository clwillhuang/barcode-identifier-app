import React from 'react'
import NavigationBar from './navigation'

export default function Wrapper({children}) {
    return(
        <div style={{minHeight: '90vh'}}>
            <NavigationBar/>
            {children}
        </div>
    )
}