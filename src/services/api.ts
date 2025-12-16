import axios from 'axios';
import keycloak from '../config/keycloak';

const API_URL = 'http://localhost:8081';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

export default api;
