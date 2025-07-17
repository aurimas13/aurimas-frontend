import React from 'react';
import { 
  Facebook, 
  Linkedin, 
  Github, 
  Twitter, 
  Instagram, 
  Youtube, 
  Camera, 
  Music, 
  Activity, 
  Coffee,
  ExternalLink
} from 'lucide-react';
import { socialLinks } from '../data/socialLinks';

const iconMap = {
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  camera: Camera,
  music: Music,
  activity: Activity,
  coffee: Coffee
};

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-3 flex-wrap gap-2">
          {socialLinks.map((link) => {
            const IconComponent = iconMap[link.icon as keyof typeof iconMap];
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:bg-yellow-50 rounded-full p-2 transition-all duration-300 transform hover:scale-110 border border-yellow-200 bg-white"
                title={link.platform}
              >
                <div className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full group-hover:bg-yellow-400 transition-colors">
                  <IconComponent className="w-3 h-3 text-white" />
                </div>
              </a>
            );
          })}
    </div>
  );
};