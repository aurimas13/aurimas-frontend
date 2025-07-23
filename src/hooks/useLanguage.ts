// import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// import { Language } from '../types';

// const languages: Language[] = [
//   { code: 'en', name: 'English', flag: '🇬🇧' },
//   { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
//   { code: 'fr', name: 'Français', flag: '🇫🇷' }
// ];

// interface LanguageContextType {
//   currentLanguage: Language['code'];
//   changeLanguage: (code: Language['code']) => void;
//   languages: Language[];
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// interface LanguageProviderProps {
//   children: ReactNode;
// }

// export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
//   const [currentLanguage, setCurrentLanguage] = useState<Language['code']>('en');

//   useEffect(() => {
//     const saved = localStorage.getItem('preferred-language') as Language['code'];
//     if (saved && languages.find(l => l.code === saved)) {
//       setCurrentLanguage(saved);
//     }
//   }, []);

//   const changeLanguage = (code: Language['code']) => {
//     setCurrentLanguage(code);
//     localStorage.setItem('preferred-language', code);
//   };

//   return (
//     <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (context === undefined) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// };

import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};