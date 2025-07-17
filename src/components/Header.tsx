import React, { useState } from 'react';
import { Menu, X, Sparkles, Edit, FileText, Image, Heart, Mail } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Sparkles },
    { id: 'about', label: t.nav.about, icon: FileText },
    { id: 'blogs', label: t.nav.blogs, icon: Edit },
    { id: 'gallery', label: t.nav.gallery, icon: Image },
    { id: 'support', label: t.nav.support, icon: Heart },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-yellow-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <img src="/UoE.png" alt="University of Edinburgh" className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-2xl font-bold text-gray-800">
              <span className="text-yellow-300">Au</span><span className="text-black">rimas</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentSection === item.id
                      ? 'bg-yellow-100 text-yellow-700 shadow-sm'
                      : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-800 hover:text-yellow-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-yellow-200">
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      currentSection === item.id
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};