import React from 'react';
import { ChevronDown, Sparkles, Heart, Code, Beaker, FileText, Image, Mail, User } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

interface HeroProps {
  onSectionChange: (section: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSectionChange }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <section className="min-h-screen relative overflow-hidden pt-20 bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-yellow-100 rounded-full opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-yellow-400 rounded-full opacity-30 animate-pulse delay-500"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 left-1/4 animate-float">
          <Beaker className="w-8 h-8 text-yellow-500 opacity-60" />
        </div>
        <div className="absolute top-48 right-1/4 animate-float delay-1000">
          <Code className="w-8 h-8 text-yellow-600 opacity-60" />
        </div>
        <div className="absolute bottom-48 left-1/3 animate-float delay-2000">
          <Heart className="w-8 h-8 text-yellow-400 opacity-60" />
        </div>
      </div>

      <div className="container mx-auto px-4 min-h-screen flex items-center relative z-10 pt-8">

        {/* Main Content */}
        <div className="text-center w-full max-w-4xl mx-auto">
          {/* Profile Image */}
          <div className="mb-8 relative">
            <div className="w-80 h-80 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl relative">
              <img
                src="/basketball.jpg"
                alt="Aurimas"
                className="w-full h-full object-cover object-center scale-125 translate-y-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-spin-slow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl text-gray-800 font-medium animate-fade-in">
              {t.hero.greeting} <span className="font-bold"><span className="text-yellow-300">Au</span><span className="text-black">rimas</span></span>
            </h1>
            
            <p className="text-3xl md:text-4xl text-black font-medium animate-fade-in delay-300">
              {t.hero.subtitle}
            </p>
            
            <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-500">
              {t.hero.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};