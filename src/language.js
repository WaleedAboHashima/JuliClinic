import { createContext, useState } from 'react';

const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('language') || localStorage.setItem('language', 'en'));

  const value = {
    language,
    setLanguage: (newLanguage) => {
      localStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
    },
    };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export { LanguageProvider, LanguageContext };