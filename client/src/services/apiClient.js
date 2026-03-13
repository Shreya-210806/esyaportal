// client/src/services/apiClient.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const api = axios.create({ baseURL: API, timeout: 15000 });