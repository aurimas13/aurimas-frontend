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
  AtSign,
  Cloud,
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
  coffee: Coffee,
  atSign: AtSign,
  cloud: Cloud,
};

export const SocialLinks: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {socialLinks.map((link) => {
        const IconComponent = iconMap[link.icon as keyof typeof iconMap];
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.platform}
            className="group inline-flex items-baseline gap-2 text-ink-soft hover:text-ink transition-colors"
          >
            <IconComponent className="w-4 h-4" />
            <span className="font-mono uppercase text-[10px] tracking-[0.22em] border-b border-transparent group-hover:border-ink transition-colors">
              {link.platform}
            </span>
          </a>
        );
      })}
    </div>
  );
};
