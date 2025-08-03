// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { HelmetProvider } from 'react-helmet-async'; // ✅ Add this import

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <SettingsProvider>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <HelmetProvider> {/* ✅ Wrap App with HelmetProvider */}
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </HelmetProvider>
    </BrowserRouter>
  </SettingsProvider>
);

// Optional: measure performance
reportWebVitals();
