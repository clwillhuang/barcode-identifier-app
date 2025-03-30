import Cookies from 'js-cookie'

// Domain of the backend API. Leave '' if same site.
const domain = 'https://barrel.utsc.utoronto.ca'
// URL address of interactive API documentation
export const swaggerRoot = `${domain}/api`
// URL address of backend API
export const urlRoot = `${domain}/api`
// URL address of static run files
export const staticRunsRoot = `${domain}/static/runs`
// Name of app
export const appName = 'Barrel Web App'

export const webRoot = 'https://barrel.utsc.utoronto.ca/app'

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