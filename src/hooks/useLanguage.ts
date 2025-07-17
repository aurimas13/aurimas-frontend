import { useState, useEffect } from 'react';
import { Language } from '../types';

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

// Global state for language
let globalLanguage: Language['code'] = 'en';
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language['code']>(globalLanguage);

  useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Language['code'];
    if (saved && languages.find(l => l.code === saved)) {
      globalLanguage = saved;
      setCurrentLanguage(saved);
    }
  }, []);

  useEffect(() => {
    const listener = () => {
      setCurrentLanguage(globalLanguage);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const changeLanguage = (code: Language['code']) => {
    globalLanguage = code;
    localStorage.setItem('preferred-language', code);
    notifyListeners();
  };

  return {
    currentLanguage,
    changeLanguage,
    languages
  };
};