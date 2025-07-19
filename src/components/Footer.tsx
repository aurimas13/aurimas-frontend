import React from 'react';
import { Heart, Mail, MapPin, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { SocialLinks } from './SocialLinks';

export const Footer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <footer className="bg-white py-16 border-t border-yellow-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Connect With Me Section - Top */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">{t.footer.connectWithMe}</h3>
          <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
            <SocialLinks />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold">
                <span className="text-yellow-300">Au</span><span className="text-black">rimas</span>
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t.footer.quickLinks}</h3>
            <div className="space-y-2">
              <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
                {t.footer.aboutMe}
              </button>
              <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
                {t.footer.myBlogs}
              </button>
              <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
                {t.nav.gallery}
              </button>
              <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
                {t.footer.supportMyWork}
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t.footer.contact}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>aurimas.nausedas@proton.me</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-200 pt-8 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Aurimas Aleksandras Nausėdas. {t.footer.rights}
            </p>
            <div className="flex items-center space-x-3 text-gray-600 text-sm mt-2 md:mt-0">
              <MapPin className="w-4 h-4" />
              <span>Edinburgh, Scotland / Vilnius, Lithuania</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};