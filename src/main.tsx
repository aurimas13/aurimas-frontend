// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// // Ensure DOM is ready
// const rootElement = document.getElementById('root');
// if (!rootElement) {
//   throw new Error('Root element not found');
// }

// // Clear loading state
// rootElement.innerHTML = '';

// createRoot(rootElement).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { LanguageProvider } from './contexts/LanguageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)