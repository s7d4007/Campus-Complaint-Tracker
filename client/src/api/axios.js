import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000, // 15 s – fail fast instead of hanging
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 globally – redirect to login; surface timeout clearly
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
            return Promise.reject({
                response: { data: { error: 'Request timed out. Please try again.' } }
            });
        }
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
