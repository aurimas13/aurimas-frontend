import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MusicPlayer } from './MusicPlayer';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isBlogManager = location.pathname === '/blog-manager';

  return (
    <div className="min-h-screen bg-white">
      {!isBlogManager && <Header />}
      
      <main>
        <Outlet />
      </main>
      
      {!isBlogManager && <Footer />}
      
      {/* Background Music Player */}
      <MusicPlayer 
        videoId="IJiHDmyhE1A"
        title="Baba Yetu"
        artist="Christopher Tin feat. Soweto Gospel Choir"
      />
    </div>
  );
};
