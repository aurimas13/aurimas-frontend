import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { BlogSection } from './components/BlogSection';
import { BlogManager } from './components/BlogManager';
import { Gallery } from './components/Gallery';
import { SupportSection } from './components/SupportSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [showBlogManager, setShowBlogManager] = useState(false);

  const renderSection = () => {
    if (showBlogManager) {
      return <BlogManager />;
    }

    switch (currentSection) {
      case 'home':
        return <Hero onSectionChange={setCurrentSection} />;
      case 'about':
        return <About />;
      case 'blogs':
        return <BlogSection onManageBlog={() => setShowBlogManager(true)} />;
      case 'gallery':
        return <Gallery />;
      case 'support':
        return <SupportSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <Hero onSectionChange={setCurrentSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-white relative w-full overflow-x-hidden">
      <Header 
        currentSection={showBlogManager ? 'blog-manager' : currentSection} 
        onSectionChange={(section) => {
          setShowBlogManager(false);
          setCurrentSection(section);
        }}
      />
      
      {renderSection()}
      {!showBlogManager && <Footer />}
      
      {/* Background Music Player */}
      <MusicPlayer 
        videoId="IJiHDmyhE1A"
        title="Baba Yetu"
        artist="Christopher Tin feat. Soweto Gospel Choir"
      />
    </div>
  );
}

export default App;