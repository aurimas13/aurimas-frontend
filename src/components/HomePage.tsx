import React from 'react';
import { Hero } from './Hero';
import { About } from './About';
import { BlogSection } from './BlogSection';
import { Gallery } from './Gallery';
import { SupportSection } from './SupportSection';
import { ContactSection } from './ContactSection';

export const HomePage: React.FC = () => {
  // Blog manager is reached via <Link to="/blog-manager"> (see Header/BlogSection)
  const handleManageBlog = () => {};

  return (
    <>
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
    </>
  );
};
