export interface LocalizedGalleryText {
  en: string;
  lt: string;
  fr: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: LocalizedGalleryText;
  title: LocalizedGalleryText;
  location: LocalizedGalleryText;
  description: LocalizedGalleryText;
  category: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: '/1_Edinburgh.jpg',
    alt: {
      en: 'Aurimas in Edinburgh during Chemistry Studies',
      lt: 'Aurimas Edinburge chemijos studijų metu',
      fr: 'Aurimas à Édimbourg pendant ses études de chimie'
    },
    title: {
      en: 'Edinburgh Chemistry Studies',
      lt: 'Edinburgo chemijos studijos',
      fr: 'Études de chimie à Édimbourg'
    },
    location: {
      en: 'Edinburgh, Scotland',
      lt: 'Edinburgas, Škotija',
      fr: 'Édimbourg, Écosse'
    },
    description: {
      en: 'Through my Chemistry Studies at the University of Edinburgh',
      lt: 'Per chemijos studijas Edinburgo universitete',
      fr: 'Grâce à mes études de chimie à l\'université d\'Édimbourg'
    },
    category: 'chemistry'
  },
  {
    id: '2',
    src: '/basketball.jpg',
    alt: {
      en: 'Aurimas playing basketball',
      lt: 'Aurimas žaidžia krepšinį',
      fr: 'Aurimas joue au basket'
    },
    title: {
      en: 'Basketball Court',
      lt: 'Krepšinio aikštelė',
      fr: 'Terrain de basket'
    },
    location: {
      en: 'Basketball Court',
      lt: 'Krepšinio aikštelė',
      fr: 'Terrain de basket'
    },
    description: {
      en: 'Playing basketball - staying active and enjoying the game',
      lt: 'Krepšinio žaismas – aktyvus laisvalaikis ir malonumas',
      fr: 'Jouer au basket - rester actif et prendre du plaisir'
    },
    category: 'events'
  },
  {
    id: '3',
    src: '/gym.JPG',
    alt: {
      en: 'Aurimas at the gym',
      lt: 'Aurimas sporto salėje',
      fr: 'Aurimas à la salle de sport'
    },
    title: {
      en: 'Gym++',
      lt: 'Gym++',
      fr: 'Gym++'
    },
    location: {
      en: 'The Gym',
      lt: 'Sporto salė',
      fr: 'La salle de sport'
    },
    description: {
      en: 'Training at the gym - maintaining fitness and health',
      lt: 'Treniruotės sporto salėje – fizinės formos ir sveikatos palaikymas',
      fr: 'S\'entraîner à la salle de sport - rester en forme et en bonne santé'
    },
    category: 'events'
  },
  {
    id: '4',
    src: '/high_lands_2.JPG',
    alt: {
      en: 'Scottish Highlands scenery',
      lt: 'Škotijos aukštumų peizažas',
      fr: 'Paysage des Hautes terres écossaises'
    },
    title: {
      en: 'Highlands of Scotland',
      lt: 'Škotijos aukštumos',
      fr: 'Hautes terres écossaises'
    },
    location: {
      en: 'Scottish Highlands',
      lt: 'Škotijos aukštumos',
      fr: 'Hautes terres écossaises'
    },
    description: {
      en: 'The breathtaking landscapes of the Scottish Highlands',
      lt: 'Nuostabūs Škotijos aukštumų peizažai',
      fr: 'Les paysages à couper le souffle des hautes terres écossaises'
    },
    category: 'nature'
  },
  {
    id: '5',
    src: '/high_lands_3.jpeg',
    alt: {
      en: 'More Scottish Highlands views',
      lt: 'Dar daugiau Škotijos aukštumų vaizdų',
      fr: 'Plus de vues des Hautes terres écossaises'
    },
    title: {
      en: 'Highlands of Scotland',
      lt: 'Škotijos aukštumos',
      fr: 'Hautes terres écossaises'
    },
    location: {
      en: 'Scottish Highlands',
      lt: 'Škotijos aukštumos',
      fr: 'Hautes terres écossaises'
    },
    description: {
      en: 'More stunning views from the Scottish Highlands',
      lt: 'Dar daugiau nuostabių vaizdų iš Škotijos aukštumų',
      fr: 'Autres vues imprenables des hautes terres écossaises'
    },
    category: 'nature'
  },
  {
    id: '6',
    src: '/homestead_run.JPG',
    alt: {
      en: 'Photo taken during homestead run',
      lt: 'Nuotrauka padaryta bėgant iš sodybos',
      fr: 'Photo prise lors d\'une course à travers la ferme'
    },
    title: {
      en: 'Homestead Run',
      lt: 'Sodyba',
      fr: 'Homestead Run'
    },
    location: {
      en: 'Lithuanian Homestead',
      lt: 'Sodyba',
      fr: 'Ferme lituanienne'
    },
    description: {
      en: 'Photo taken during a run through the homestead',
      lt: 'Nuotrauka padaryta bėgant iš sodybos',
      fr: 'Photo prise lors d\'une course à travers la ferme'
    },
    category: 'homestead'
  },
  {
    id: '7',
    src: '/sodyboj_1.JPG',
    alt: {
      en: 'At the homestead',
      lt: 'Sodyboje',
      fr: 'À la ferme'
    },
    title: {
      en: 'At the homestead',
      lt: 'Sodyboje',
      fr: 'À la ferme'
    },
    location: {
      en: 'Lithuanian Homestead',
      lt: 'Sodyba',
      fr: 'Ferme lituanienne'
    },
    description: {
      en: 'Peaceful moments at the family homestead',
      lt: 'Ramūs akimirkos šeimos sodyboje',
      fr: 'Moments paisibles à la ferme familiale'
    },
    category: 'homestead'
  },
  {
    id: '8',
    src: '/sodyboj_2.JPG',
    alt: {
      en: 'More homestead moments',
      lt: 'Dar daugiau sodybos akimirkų',
      fr: 'Plus de moments à la ferme'
    },
    title: {
      en: 'At Homestead',
      lt: 'Sodyboje',
      fr: 'À la ferme'
    },
    location: {
      en: 'Lithuanian Homestead',
      lt: 'Sodyba',
      fr: 'Ferme lituanienne'
    },
    description: {
      en: 'More cherished moments at the homestead',
      lt: 'Dar daugiau brangių akimirkų sodyboje',
      fr: 'Autres moments précieux à la ferme'
    },
    category: 'homestead'
  },
  {
    id: '9',
    src: '/sun.JPG',
    alt: {
      en: 'Highland sunset during run',
      lt: 'Aukštumų saulėlydis bėgimo metu',
      fr: 'Coucher de soleil dans les Highlands pendant la course'
    },
    title: {
      en: 'Highland Sunset',
      lt: 'Aukštumų saulėlydis',
      fr: 'Coucher de soleil dans les Highlands'
    },
    location: {
      en: 'Scottish Highlands',
      lt: 'Škotijos aukštumos',
      fr: 'Highlands écossais'
    },
    description: {
      en: 'A photo of highlands taken during a run when I stopped to capture this moment',
      lt: 'Aukštumų nuotrauka, padaryta bėgant, kai sustojau užfiksuoti šią akimirką',
      fr: 'Photo des Highlands prise pendant une course, lorsque je me suis arrêté pour immortaliser ce moment'
    },
    category: 'nature'
  },
  {
    id: '10',
    src: '/less.jpg',
    alt: {
      en: 'Less is more philosophy',
      lt: 'Mažiau yra daugiau filosofija',
      fr: 'Philosophie moins c\'est mieux'
    },
    title: {
      en: 'Less is More',
      lt: 'Mažiau yra daugiau',
      fr: 'Moins, c\'est mieux'
    },
    location: {
      en: 'Life Philosophy',
      lt: 'Gyvenimo filosofija',
      fr: 'Philosophie de vie'
    },
    description: {
      en: 'Sometimes less is more - embracing simplicity and mindfulness',
      lt: 'Kartais mažiau yra daugiau – priimu paprastumą ir sąmoningumą',
      fr: 'Parfois, moins c\'est mieux : embrasser la simplicité et la pleine conscience'
    },
    category: 'events'
  }
];
