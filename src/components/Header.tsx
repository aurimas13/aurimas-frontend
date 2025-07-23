// import React, { useState } from 'react';
// import { Menu, X, Edit, FileText, Image, Heart, Mail } from 'lucide-react';
// import { LanguageSwitcher } from './LanguageSwitcher';
// import { useLanguage } from '../hooks/useLanguage';
// import { translations } from '../data/translations';

// interface HeaderProps {
//   currentSection: string;
//   onSectionChange: (section: string) => void;
// }

// export const Header: React.FC<HeaderProps> = ({ currentSection, onSectionChange }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { currentLanguage } = useLanguage();
//   const t = translations[currentLanguage];

//   const navItems = [
//     { id: 'home', label: t.nav.home, icon: Image },
//     { id: 'about', label: t.nav.about, icon: FileText },
//     { id: 'blogs', label: t.nav.blogs, icon: Edit },
//     { id: 'gallery', label: t.nav.gallery, icon: Image },
//     { id: 'support', label: t.nav.support, icon: Heart },
//     { id: 'contact', label: 'Contact', icon: Mail }
//   ];

//   return (
//     <header className="fixed top-0 w-screen bg-white/95 backdrop-blur-md z-50 shadow-sm border-b border-yellow-200">
//       <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <img src="/UoE.png" alt="University of Edinburgh" className="w-8 h-8 rounded-full" />
//             <span className="text-2xl font-bold text-gray-800">
//               <span className="text-yellow-300">Au</span><span className="text-black">rimas</span>
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => onSectionChange(item.id)}
//                   className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
//                     currentSection === item.id
//                       ? 'bg-yellow-100 text-yellow-700 shadow-sm'
//                       : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Right side controls */}
//           <div className="flex items-center space-x-4">
//             <LanguageSwitcher />
            
//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden text-gray-800 hover:text-yellow-600 transition-colors"
//             >
//               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <nav className="md:hidden mt-4 pb-4 border-t border-yellow-200">
//             <div className="flex flex-col space-y-3 pt-4">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <button
//                     key={item.id}
//                     onClick={() => {
//                       onSectionChange(item.id);
//                       setIsMenuOpen(false);
//                     }}
//                     className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
//                       currentSection === item.id
//                         ? 'bg-yellow-100 text-yellow-700'
//                         : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span className="font-medium">{item.label}</span>
//                   </button>
//                 );
//               })}
//             </div>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// };

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <img 
                src="/UoE.png" 
                alt="University of Edinburgh" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">Aurimas</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {t.navigation.home}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {t.navigation.about}
            </button>
            <button
              onClick={() => scrollToSection('blog')}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {t.navigation.blog}
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {t.navigation.gallery}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {t.navigation.contact}
            </button>
            <button
              onClick={() => scrollToSection('support')}
              className="text-gray-700 hover:text-amber-600 transition-colors"
            >
              {t.navigation.support}
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-amber-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <button
                onClick={() => scrollToSection('hero')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                {t.navigation.home}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                {t.navigation.about}
              </button>
              <button
                onClick={() => scrollToSection('blog')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                {t.navigation.blog}
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                {t.navigation.gallery}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                {t.navigation.contact}
              </button>
              <button
                onClick={() => scrollToSection('support')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 rounded-md"
              >
                {t.navigation.support}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}