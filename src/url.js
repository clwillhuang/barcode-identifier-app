import Cookies from 'js-cookie'

export const docsRoot = 'http://localhost:8000'
export const urlRoot = 'http://localhost:8000'
export const runsFolder = 'static/runs'
export const appName = 'Barcode Identifier Web App'

// TODO: Change to domain name once known
export const webRoot = 'https://fish-barcodes.com/'

export const generateHeaders = (additionalHeaders) => {
    const token = Cookies.get('knox')
    return token ? 
    {
         ...additionalHeaders,
        'Authorization': `Bearer ${token}`
    } : additionalHeaders
}

export const hasSignInCookie = () => {
    return typeof Cookies.get('knox') !== 'undefined'
}