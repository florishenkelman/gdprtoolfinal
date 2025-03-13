import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext'; // Theme context provider
import { AuthProvider } from './context/AuthContext';   // Auth context provider

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>
);