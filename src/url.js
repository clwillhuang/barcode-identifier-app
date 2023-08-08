import Cookies from 'js-cookie'

const domain = ''
// URL address of interactive API documentation
export const swaggerRoot = `${domain}/api`
// URL address of backend API
export const urlRoot = `${domain}/api`
// URL address of static run files
export const staticRunsRoot = `${domain}/static/runs`
// Name of app
export const appName = 'Barrel Web App'

// TODO: Change to domain name once known
export const webRoot = 'https://fish-barcodes.com/'

export const generateHeaders = (additionalHeaders) => {
    const token = Cookies.get('knox')
    return token ? 
    {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...additionalHeaders
    } : additionalHeaders
}

export const hasSignInCookie = () => {
    return typeof Cookies.get('knox') !== 'undefined'
}