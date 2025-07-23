// import React, { useState } from 'react';
// import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
// import { useLanguage } from '../hooks/useLanguage';
// import { translations } from '../data/translations';

// export const Gallery: React.FC = () => {
//   const { currentLanguage } = useLanguage();
//   const t = translations[currentLanguage];
//   const [selectedImage, setSelectedImage] = useState<number | null>(null);

//   const galleryImages = [
//     {
//       src: '/1_Edinburgh.jpg',
//       alt: 'Aurimas in Edinburgh',
//       title: 'Edinburgh Adventures',
//       location: 'Edinburgh, Scotland',
//       description: 'Exploring the beautiful city of Edinburgh during my time at the University.'
//     },
//     {
//       src: '/basketball.jpg',
//       alt: 'Aurimas playing basketball',
//       title: 'Basketball Passion',
//       location: 'Local Court',
//       description: 'Enjoying a game of basketball - one of my favorite ways to stay active and clear my mind.'
//     },
//     {
//       src: '/gym.JPG',
//       alt: 'Aurimas at the gym',
//       title: 'Fitness Journey',
//       location: 'Gym',
//       description: 'Staying fit and healthy is essential for maintaining the energy needed for coding and writing.'
//     },
//     {
//       src: '/high_lands_2.JPG',
//       alt: 'Highland scenery',
//       title: 'Highland Beauty',
//       location: 'Scottish Highlands',
//       description: 'The stunning landscapes of the Scottish Highlands that inspire my daily walks.'
//     },
//     {
//       src: '/high_lands_3.jpeg',
//       alt: 'More highland scenery',
//       title: 'Mountain Views',
//       location: 'Scottish Highlands',
//       description: 'The breathtaking views remind me why I love living in Scotland.'
//     },
//     {
//       src: '/sodyboj_1.JPG',
//       alt: 'Aurimas at homestead',
//       title: 'Homestead Life',
//       location: 'Lithuanian Countryside',
//       description: 'Connecting with my Lithuanian roots at the family homestead.'
//     },
//     {
//       src: '/sodyboj_2.JPG',
//       alt: 'More homestead photos',
//       title: 'Rural Tranquility',
//       location: 'Lithuanian Countryside',
//       description: 'Finding peace and inspiration in the quiet countryside.'
//     },
//     {
//       src: '/sun.JPG',
//       alt: 'Sunset horizon',
//       title: 'Golden Hour',
//       location: 'Lake View',
//       description: 'Capturing the perfect sunset - moments like these fuel my writing.'
//     },
//     {
//       src: '/homestead_run.JPG',
//       alt: 'Running at the homestead',
//       title: 'Homestead Run',
//       location: 'Lithuanian Countryside',
//       description: 'Morning runs through the peaceful countryside, connecting with nature and my roots.'
//     }
//   ];

//   const nextImage = () => {
//     if (selectedImage !== null) {
//       setSelectedImage((selectedImage + 1) % galleryImages.length);
//     }
//   };

//   const prevImage = () => {
//     if (selectedImage !== null) {
//       setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
//     }
//   };

//   return (
//     <section id="gallery" className="py-20 bg-gradient-to-br from-lime-25 to-green-25">
//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
//             {t.gallery.title}
//           </h2>
//           <p className="text-xl text-gray-800 mb-8">
//             {t.gallery.subtitle}
//           </p>
//           <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
//         </div>

//         {/* Gallery Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {galleryImages.map((image, index) => (
//             <div
//               key={index}
//               className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
//               onClick={() => setSelectedImage(index)}
//             >
//               <img
//                 src={image.src}
//                 alt={image.alt}
//                 className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <div className="absolute bottom-4 left-4 text-white">
//                   <h3 className="font-bold text-lg">{image.title}</h3>
//                   <div className="flex items-center text-sm opacity-90">
//                     <MapPin className="w-4 h-4 mr-1" />
//                     {image.location}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Lightbox Modal */}
//         {selectedImage !== null && (
//           <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//             <div className="relative max-w-4xl w-full">
//               {/* Close Button */}
//               <button
//                 onClick={() => setSelectedImage(null)}
//                 className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
//               >
//                 <X className="w-8 h-8" />
//               </button>

//               {/* Navigation Buttons */}
//               <button
//                 onClick={prevImage}
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
//               >
//                 <ChevronLeft className="w-8 h-8" />
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
//               >
//                 <ChevronRight className="w-8 h-8" />
//               </button>

//               {/* Image */}
//               <img
//                 src={galleryImages[selectedImage].src}
//                 alt={galleryImages[selectedImage].alt}
//                 className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
//               />

//               {/* Image Info */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
//                 <h3 className="text-2xl font-bold mb-2">{galleryImages[selectedImage].title}</h3>
//                 <div className="flex items-center mb-2 text-gray-300">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   {galleryImages[selectedImage].location}
//                 </div>
//                 <p className="text-gray-200">{galleryImages[selectedImage].description}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  location: string;
  description: string;
  category: string;
}

export const Gallery: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Real gallery images from public folder
  const images: GalleryImage[] = [
    {
      id: '1',
      src: '/1_Edinburgh.jpg',
      alt: 'Aurimas in Edinburgh during Chemistry Studies',
      title: 'Edinburgh Chemistry Studies',
      location: 'Edinburgh, Scotland',
      description: 'Through my Chemistry Studies at the University of Edinburgh',
      category: 'chemistry'
    },
    {
      id: '2',
      src: '/basketball.jpg',
      alt: 'Aurimas playing basketball',
      title: 'Basketball Court',
      location: 'Basketball Court',
      description: 'Playing basketball - staying active and enjoying the game',
      category: 'events'
    },
    {
      id: '3',
      src: '/gym.JPG',
      alt: 'Aurimas at the gym',
      title: 'Gym++',
      location: 'The Gym',
      description: 'Training at the gym - maintaining fitness and health',
      category: 'events'
    },
    {
      id: '4',
      src: '/high_lands_2.JPG',
      alt: 'Scottish Highlands scenery',
      title: 'Highlands of Scotland',
      location: 'Scottish Highlands',
      description: 'The breathtaking landscapes of the Scottish Highlands',
      category: 'nature'
    },
    {
      id: '5',
      src: '/high_lands_3.jpeg',
      alt: 'More Scottish Highlands views',
      title: 'Highlands of Scotland',
      location: 'Scottish Highlands',
      description: 'More stunning views from the Scottish Highlands',
      category: 'nature'
    },
    {
      id: '6',
      src: '/homestead_run.JPG',
      alt: 'Photo taken during homestead run',
      title: 'Homestead Run',
      location: 'Lithuanian Homestead',
      description: 'Photo taken during a run through the homestead',
      category: 'homestead'
    },
    {
      id: '7',
      src: '/sodyboj_1.JPG',
      alt: 'At the homestead',
      title: 'At Homestead',
      location: 'Lithuanian Homestead',
      description: 'Peaceful moments at the family homestead',
      category: 'homestead'
    },
    {
      id: '8',
      src: '/sodyboj_2.JPG',
      alt: 'More homestead moments',
      title: 'At Homestead',
      location: 'Lithuanian Homestead',
      description: 'More cherished moments at the homestead',
      category: 'homestead'
    },
    {
      id: '9',
      src: '/sun.JPG',
      alt: 'Highland sunset during run',
      title: 'Highland Sunset',
      location: 'Scottish Highlands',
      description: 'A photo of highlands taken during a run when I stopped to capture this moment',
      category: 'nature'
    },
    {
      id: '10',
      src: '/less.jpg',
      alt: 'Less is more philosophy',
      title: 'Less is More',
      location: 'Life Philosophy',
      description: 'Sometimes less is more - embracing simplicity and mindfulness',
      category: 'events'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setSelectedImage(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-lime-25 to-green-25">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.gallery.title}
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            {t.gallery.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(t.gallery.categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === key
                  ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-yellow-100 border border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                  target.alt = 'Image not found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
                  <div className="flex items-center text-yellow-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {image.location}
                  </div>
                  <p className="text-gray-200 text-sm">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold mb-2">{filteredImages[selectedImage].title}</h3>
                <div className="flex items-center mb-2 text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {filteredImages[selectedImage].location}
                </div>
                <p className="text-gray-200">{filteredImages[selectedImage].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};