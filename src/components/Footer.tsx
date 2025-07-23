// import React from 'react';
// import { Heart, Mail, MapPin, Sparkles } from 'lucide-react';
// import { useLanguage } from '../hooks/useLanguage';
// import { translations } from '../data/translations';
// import { SocialLinks } from './SocialLinks';

// export const Footer: React.FC = () => {
//   const { currentLanguage } = useLanguage();
//   const t = translations[currentLanguage];

//   return (
//     <footer className="bg-white py-16 border-t border-yellow-200">
//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Connect With Me Section - Top */}
//         <div className="text-center mb-12">
//           <h3 className="text-3xl font-bold text-gray-800 mb-8">{t.footer.connectWithMe}</h3>
//           <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
//             <SocialLinks />
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 mb-8">
//           {/* Brand */}
//           <div>
//             <div className="flex items-center space-x-2 mb-4">
//               <Sparkles className="w-8 h-8 text-yellow-500" />
//               <span className="text-2xl font-bold">
//                 <span className="text-yellow-300">Au</span><span className="text-black">rimas</span>
//               </span>
//             </div>
//             <p className="text-gray-600 leading-relaxed">
//               {t.footer.description}
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-4">{t.footer.quickLinks}</h3>
//             <div className="space-y-2">
//               <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
//                 {t.footer.aboutMe}
//               </button>
//               <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
//                 {t.footer.myBlogs}
//               </button>
//               <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
//                 {t.nav.gallery}
//               </button>
//               <button className="block text-gray-600 hover:text-yellow-600 transition-colors text-left">
//                 {t.footer.supportMyWork}
//               </button>
//             </div>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="text-xl font-bold text-gray-800 mb-4">{t.footer.contact}</h3>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3 text-gray-600">
//                 <Mail className="w-5 h-5" />
//                 <span>aurimas.nausedas@proton.me</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-yellow-200 pt-8 pb-6">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-600 text-sm">
//               © 2025 Aurimas Aleksandras Nausėdas. {t.footer.rights}
//             </p>
//             <div className="flex items-center space-x-3 text-gray-600 text-sm mt-2 md:mt-0">
//               <MapPin className="w-4 h-4" />
//               <span>Edinburgh, Scotland / Vilnius, Lithuania</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

import React from 'react';
import { Heart, Github, Linkedin, Mail, Facebook, Instagram, Twitter, Youtube, Camera, Music, Activity } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export function Footer() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <footer className="bg-gradient-to-br from-lime-25 to-yellow-25 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Aurimas Aleksandras Nausėdas</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  {t.navigation.about}
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  {t.navigation.blog}
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  {t.navigation.gallery}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-amber-600 transition-colors text-sm">
                  {t.navigation.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.footer.connect}</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/aurimas13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/aurimasnausedas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:aurimas.nausedas@proton.me"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://www.facebook.com/auris13/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/reksas13/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/reksas13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.youtube.com/@aurimas13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://unsplash.com/@aurimas13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Camera size={20} />
              </a>
              <a
                href="https://open.spotify.com/user/aurimas.n"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Music size={20} />
              </a>
              <a
                href="https://www.strava.com/athletes/aurimas13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Activity size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center">
            {t.footer.madeWith} <Heart size={16} className="mx-1 text-red-500" /> {t.footer.byAurimas}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} Aurimas Aleksandras Nausėdas. {t.footer.allRights}
          </p>
        </div>
      </div>
    </footer>
  );
}