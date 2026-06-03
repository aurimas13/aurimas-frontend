import React from 'react';
import { AppRouter } from './AppRouter';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
}

export default App;
