// src/utils/api.js
import { API_BASE_URL } from './config';

async function request(endpoint, method = 'GET', body = null, customHeaders = {}) {
    const headers = { ...customHeaders };
    let payload = body;

    if (body) {
        if (body instanceof FormData) {
            payload = body;
        } else {
            headers['Content-Type'] = 'application/json';
            payload = JSON.stringify(body);
        }
    }

    const config = {
        method,
        headers, 
        ...(body && { body: payload }),
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorMessage = (data && data.message) || 
                                 (data && data.error) || 
                                 (typeof data === 'string' ? data : `Error ${response.status}`);
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error(`API Error en ${method} ${endpoint}:`, error);
        throw error;
    }
}

export const api = {
    get: (endpoint) => request(endpoint, 'GET'),
    post: (endpoint, body) => request(endpoint, 'POST', body),
    put: (endpoint, body) => request(endpoint, 'PUT', body),
    delete: (endpoint, body) => request(endpoint, 'DELETE', body),
};