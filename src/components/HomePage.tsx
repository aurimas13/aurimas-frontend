import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from './Hero';
import { About } from './About';
import { BlogSection } from './BlogSection';
import { Gallery } from './Gallery';
import { SupportSection } from './SupportSection';
import { ContactSection } from './ContactSection';

export const HomePage: React.FC = () => {
  const handleManageBlog = () => {
    // This will be handled by the Link to /blog-manager
    console.log('Navigate to blog manager');
  };

  return (
    <main>
      <div id="hero">
        <Hero onSectionChange={() => {}} />
      </div>
      
      <div id="about">
        <About />
      </div>
      
      <div id="blog">
        <BlogSection onManageBlog={handleManageBlog} />
      </div>
      
      <div id="gallery">
        <Gallery />
      </div>
      
      <div id="support">
        <SupportSection />
      </div>
      
      <div id="contact">
        <ContactSection />
      </div>
    </main>
  );
};
