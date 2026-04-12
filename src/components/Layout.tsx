import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

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
    </div>
  );
};
