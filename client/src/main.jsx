import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <Toaster position="top-center" toastOptions={{
                    style: { background: '#1f2937', color: '#fff' }
                }} />
                <App />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
