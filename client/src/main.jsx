import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <Toaster position="top-center" toastOptions={{
                style: { background: '#1f2937', color: '#fff' }
            }} />
            <App />
        </AuthProvider>
    </React.StrictMode>,
);
