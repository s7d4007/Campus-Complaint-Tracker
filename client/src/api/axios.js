import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 45000, // 45 s — covers Render free-tier cold start (can take 30-50 s)
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
                response: { data: { error: 'Server is taking too long to respond. It may be waking up — please try again in a moment.' } }
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
