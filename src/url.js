import Cookies from 'js-cookie'

export const docsRoot = '/api'
export const urlRoot = '/api'
export const runsFolder = 'static/runs'
export const appName = 'Barrel Web App'

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