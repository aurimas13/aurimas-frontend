// // import React, { useState, useEffect } from 'react';
// // import { Header } from './components/Header';
// // import { Hero } from './components/Hero';
// // import { About } from './components/About';
// // import { BlogSection } from './components/BlogSection';
// // import { BlogManager } from './components/BlogManager';
// // import { Gallery } from './components/Gallery';
// // import { SupportSection } from './components/SupportSection';
// // import { ContactSection } from './components/ContactSection';
// // import { Footer } from './components/Footer';
// // import { MusicPlayer } from './components/MusicPlayer';

// // function App() {
// //   const [currentSection, setCurrentSection] = useState('home');
// //   const [showBlogManager, setShowBlogManager] = useState(false);

// //   const handleManageBlog = () => {
// //     console.log('handleManageBlog called, setting showBlogManager to true');
// //     setShowBlogManager(true);
// //     setCurrentSection('blogs');
// //   };

// //   const renderSection = () => {
// //     if (showBlogManager) {
// //       return <BlogManager onBack={() => setShowBlogManager(false)} />;
// //     }

// //     switch (currentSection) {
// //       case 'home':
// //         return <Hero onSectionChange={setCurrentSection} />;
// //       case 'about':
// //         return <About />;
// //       case 'blogs':
// //         return <BlogSection onManageBlog={handleManageBlog} />;
// //       case 'gallery':
// //         return <Gallery />;
// //       case 'support':
// //         return <SupportSection />;
// //       case 'contact':
// //         return <ContactSection />;
// //       default:
// //         return <Hero onSectionChange={setCurrentSection} />;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-white relative w-screen min-w-screen max-w-screen overflow-x-hidden">
// //       <Header 
// //         currentSection={showBlogManager ? 'blogs' : currentSection} 
// //         onSectionChange={(section) => {
// //           setShowBlogManager(false);
// //           setCurrentSection(section);
// //         }}
// //       />
      
// //       {renderSection()}
// //       {!showBlogManager && <Footer />}
      
// //       {/* Background Music Player */}
// //       <MusicPlayer 
// //         videoId="IJiHDmyhE1A"
// //         title="Baba Yetu"
// //         artist="Christopher Tin feat. Soweto Gospel Choir"
// //       />
// //     </div>
// //   );
// // }

// import React, { useState } from 'react';
// import { Header } from './components/Header';
// import { Hero } from './components/Hero';
// import { About } from './components/About';
// import { BlogSection } from './components/BlogSection';
// import { BlogManager } from './components/BlogManager';
// import { Gallery } from './components/Gallery';
// import { SupportSection } from './components/SupportSection';
// import { ContactSection } from './components/ContactSection';
// import { Footer } from './components/Footer';
// import { MusicPlayer } from './components/MusicPlayer';

// function App() {
//   const [showBlogManager, setShowBlogManager] = useState(false);

//   const handleManageBlog = () => {
//     console.log('handleManageBlog called');
//     setShowBlogManager(true);
//   };

//   if (showBlogManager) {
//     return (
//       <div className="min-h-screen bg-white">
//         <BlogManager onBack={() => setShowBlogManager(false)} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Header />
      
//       <main>
//         <div id="hero">
//           <Hero onSectionChange={() => {}} />
//         </div>
        
//         <div id="about">
//           <About />
//         </div>
        
//         <div id="blog">
//           <BlogSection onManageBlog={handleManageBlog} />
//         </div>
        
//         <div id="gallery">
//           <Gallery />
//         </div>
        
//         <div id="support">
//           <SupportSection />
//         </div>
        
//         <div id="contact">
//           <ContactSection />
//         </div>
//       </main>
      
//       <Footer />
      
//       {/* Background Music Player */}
//       <MusicPlayer 
//         videoId="IJiHDmyhE1A"
//         title="Baba Yetu"
//         artist="Christopher Tin feat. Soweto Gospel Choir"
//       />
//     </div>
//   );
// }

// export default App;

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
// import React, { useState, useEffect } from 'react';
// import { Header } from './components/Header';
// import { Hero } from './components/Hero';
// import { About } from './components/About';
// import { BlogSection } from './components/BlogSection';
// import { BlogManager } from './components/BlogManager';
// import { Gallery } from './components/Gallery';
// import { SupportSection } from './components/SupportSection';
// import { ContactSection } from './components/ContactSection';
// import { Footer } from './components/Footer';
// import { MusicPlayer } from './components/MusicPlayer';

// function App() {
//   const [currentSection, setCurrentSection] = useState('home');
//   const [showBlogManager, setShowBlogManager] = useState(false);

//   const handleManageBlog = () => {
//     console.log('handleManageBlog called, setting showBlogManager to true');
//     setShowBlogManager(true);
//     setCurrentSection('blogs');
//   };

//   const renderSection = () => {
//     if (showBlogManager) {
//       return <BlogManager onBack={() => setShowBlogManager(false)} />;
//     }

//     switch (currentSection) {
//       case 'home':
//         return <Hero onSectionChange={setCurrentSection} />;
//       case 'about':
//         return <About />;
//       case 'blogs':
//         return <BlogSection onManageBlog={handleManageBlog} />;
//       case 'gallery':
//         return <Gallery />;
//       case 'support':
//         return <SupportSection />;
//       case 'contact':
//         return <ContactSection />;
//       default:
//         return <Hero onSectionChange={setCurrentSection} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white relative w-screen min-w-screen max-w-screen overflow-x-hidden">
//       <Header 
//         currentSection={showBlogManager ? 'blogs' : currentSection} 
//         onSectionChange={(section) => {
//           setShowBlogManager(false);
//           setCurrentSection(section);
//         }}
//       />
      
//       {renderSection()}
//       {!showBlogManager && <Footer />}
      
//       {/* Background Music Player */}
//       <MusicPlayer 
//         videoId="IJiHDmyhE1A"
//         title="Baba Yetu"
//         artist="Christopher Tin feat. Soweto Gospel Choir"
//       />
//     </div>
//   );
// }

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