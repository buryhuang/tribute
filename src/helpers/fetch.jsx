import axios from 'axios';

export default async function (endpoint = null, method = 'GET', data = null, hasFiles = false, options = null) {
    const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    // Convert method text to uppercase
    method = method.toUpperCase();

    // Check if method is supported
    if(!supportedMethods.includes(method)) throw new Error(`Request method not supported. Supported methods are ${supportedMethods.join(', ')}.`);
    if(typeof baseURL === 'undefined' || baseURL === '') throw new Error(`Base URL is not defined. Please set a base url in the .env file with the key 'NEXT_PUBLIC_API_URL'.`);

    // Header
    let headersConfig = {
        'Content-Type': hasFiles ? 'multipart/form-data' : 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': window?.location?.origin || '*',
        'Authorization': `Bearer `,
    }

    // If has extra options
    if(options !== null) {
        headersConfig = {
            ...headersConfig,
            ...options,
        }
    };

    return await axios({
        url: `${baseURL}${endpoint}`,
        method: method,
        headers: headersConfig,
        data: data,
    })
    .then(response => response.data);
}