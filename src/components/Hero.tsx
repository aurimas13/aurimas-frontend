import React from 'react';
import { ChevronDown, Heart, Code, Beaker, FileText, Image, Mail, User } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

interface HeroProps {
  onSectionChange: (section: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSectionChange }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <section className="relative overflow-hidden pt-16 pb-12 bg-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden w-full">
        <div className="absolute top-20 left-4 md:left-[8%] w-16 md:w-20 h-16 md:h-20 bg-yellow-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-40 right-4 md:right-[8%] w-12 md:w-16 h-12 md:h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 left-4 md:left-[12%] w-20 md:w-24 h-20 md:h-24 bg-yellow-100 rounded-full opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-4 md:right-[12%] w-10 md:w-12 h-10 md:h-12 bg-yellow-400 rounded-full opacity-30 animate-pulse delay-500"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 left-[15%] animate-float hidden lg:block transform hover:scale-125 transition-transform duration-300">
          <Beaker className="w-6 md:w-8 h-6 md:h-8 text-yellow-500 opacity-60" />
        </div>
        <div className="absolute top-48 right-[15%] animate-float delay-1000 hidden lg:block transform hover:scale-125 transition-transform duration-300">
          <Code className="w-6 md:w-8 h-6 md:h-8 text-yellow-600 opacity-60" />
        </div>
        <div className="absolute bottom-48 left-[25%] animate-float delay-2000 hidden lg:block transform hover:scale-125 transition-transform duration-300">
          <Heart className="w-6 md:w-8 h-6 md:h-8 text-yellow-400 opacity-60" />
        </div>
        
        {/* Additional Creative Floating Elements */}
        <div className="absolute top-60 left-[8%] animate-float delay-3000 hidden lg:block transform hover:rotate-12 transition-transform duration-500">
          <FileText className="w-5 h-5 text-green-500 opacity-50" />
        </div>
        <div className="absolute bottom-32 right-[8%] animate-float delay-4000 hidden lg:block transform hover:-rotate-12 transition-transform duration-500">
          <Image className="w-5 h-5 text-blue-500 opacity-50" />
        </div>
        <div className="absolute top-80 right-[30%] animate-float delay-5000 hidden lg:block transform hover:scale-150 transition-transform duration-400">
          <Mail className="w-4 h-4 text-purple-500 opacity-40" />
        </div>
        <div className="absolute bottom-60 left-[40%] animate-float delay-6000 hidden lg:block transform hover:scale-110 transition-transform duration-600">
          <User className="w-4 h-4 text-red-500 opacity-40" />
        </div>
      </div>

      <div className="w-screen px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center relative z-10 pt-8">

        {/* Main Content */}
        <div className="text-center w-full max-w-7xl mx-auto">
          {/* Profile Image */}
          <div className="mb-8 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl relative">
              <img
                src="/basketball.jpg"
                alt="Aurimas"
                className="w-full h-full object-cover object-center scale-110 md:scale-125 translate-y-1 md:translate-y-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-800 font-medium animate-fade-in leading-tight">
              {t.hero.greeting} <span className="font-bold"><span className="text-yellow-300">Au</span><span className="text-black">rimas</span></span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-medium animate-fade-in delay-300 leading-tight">
              {t.hero.subtitle}
            </p>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed animate-fade-in delay-500">
              {t.hero.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};