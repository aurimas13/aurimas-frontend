
// import React, { useState } from 'react';
// import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
// import { useLanguage } from '../hooks/useLanguage';
// import { translations } from '../data/translations';

// interface GalleryImage {
//   id: string;
//   src: string;
//   alt: string;
//   title: string;
//   location: string;
//   description: string;
//   category: string;
// }

// export const Gallery: React.FC = () => {
//   const { currentLanguage } = useLanguage();
//   const t = translations[currentLanguage] || translations.en;
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedImage, setSelectedImage] = useState<number | null>(null);

//   // Real gallery images from public folder
//   const images: GalleryImage[] = [
//     {
//       id: '1',
//       src: '/1_Edinburgh.jpg',
//       alt: 'Aurimas in Edinburgh during Chemistry Studies',
//       title: 'Edinburgh Chemistry Studies',
//       location: 'Edinburgh, Scotland',
//       description: 'Through my Chemistry Studies at the University of Edinburgh',
//       category: 'chemistry'
//     },
//     {
//       id: '2',
//       src: '/basketball.jpg',
//       alt: 'Aurimas playing basketball',
//       title: 'Basketball Court',
//       location: 'Basketball Court',
//       description: 'Playing basketball - staying active and enjoying the game',
//       category: 'events'
//     },
//     {
//       id: '3',
//       src: '/gym.JPG',
//       alt: 'Aurimas at the gym',
//       title: 'Gym++',
//       location: 'The Gym',
//       description: 'Training at the gym - maintaining fitness and health',
//       category: 'events'
//     },
//     {
//       id: '4',
//       src: '/high_lands_2.JPG',
//       alt: 'Scottish Highlands scenery',
//       title: 'Highlands of Scotland',
//       location: 'Scottish Highlands',
//       description: 'The breathtaking landscapes of the Scottish Highlands',
//       category: 'nature'
//     },
//     {
//       id: '5',
//       src: '/high_lands_3.jpeg',
//       alt: 'More Scottish Highlands views',
//       title: 'Highlands of Scotland',
//       location: 'Scottish Highlands',
//       description: 'More stunning views from the Scottish Highlands',
//       category: 'nature'
//     },
//     {
//       id: '6',
//       src: '/homestead_run.JPG',
//       alt: 'Photo taken during homestead run',
//       title: 'Homestead Run',
//       location: 'Lithuanian Homestead',
//       description: 'Photo taken during a run through the homestead',
//       category: 'homestead'
//     },
//     {
//       id: '7',
//       src: '/sodyboj_1.JPG',
//       alt: 'At the homestead',
//       title: 'At Homestead',
//       location: 'Lithuanian Homestead',
//       description: 'Peaceful moments at the family homestead',
//       category: 'homestead'
//     },
//     {
//       id: '8',
//       src: '/sodyboj_2.JPG',
//       alt: 'More homestead moments',
//       title: 'At Homestead',
//       location: 'Lithuanian Homestead',
//       description: 'More cherished moments at the homestead',
//       category: 'homestead'
//     },
//     {
//       id: '9',
//       src: '/sun.JPG',
//       alt: 'Highland sunset during run',
//       title: 'Highland Sunset',
//       location: 'Scottish Highlands',
//       description: 'A photo of highlands taken during a run when I stopped to capture this moment',
//       category: 'nature'
//     },
//     {
//       id: '10',
//       src: '/less.jpg',
//       alt: 'Less is more philosophy',
//       title: 'Less is More',
//       location: 'Life Philosophy',
//       description: 'Sometimes less is more - embracing simplicity and mindfulness',
//       category: 'events'
//     }
//   ];

//   const filteredImages = selectedCategory === 'all' 
//     ? images 
//     : images.filter(img => img.category === selectedCategory);

//   const nextImage = () => {
//     if (selectedImage !== null) {
//       setSelectedImage((selectedImage + 1) % filteredImages.length);
//     }
//   };

//   const prevImage = () => {
//     if (selectedImage !== null) {
//       setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
//     }
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (selectedImage !== null) {
//       if (e.key === 'ArrowRight') nextImage();
//       if (e.key === 'ArrowLeft') prevImage();
//       if (e.key === 'Escape') setSelectedImage(null);
//     }
//   };

//   React.useEffect(() => {
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [selectedImage]);

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

//         {/* Category Filter */}
//         <div className="flex flex-wrap justify-center gap-4 mb-12">
//           {Object.entries(t.gallery.categories).map(([key, label]) => (
//             <button
//               key={key}
//               onClick={() => setSelectedCategory(key)}
//               className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
//                 selectedCategory === key
//                   ? 'bg-yellow-500 text-white shadow-lg transform scale-105'
//                   : 'bg-white text-gray-700 hover:bg-yellow-100 border border-gray-300'
//               }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Image Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {filteredImages.map((image, index) => (
//             <div
//               key={image.id}
//               className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
//               onClick={() => setSelectedImage(index)}
//             >
//               <img
//                 src={image.src}
//                 alt={image.alt}
//                 className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
//                 loading="lazy"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   console.error('Failed to load image:', image.src);
//                   target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY5NzM4MyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+KCR7aW1hZ2Uuc3JjfSk8L3RleHQ+PC9zdmc+';
//                   target.alt = 'Image not found';
//                 }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <div className="absolute bottom-0 left-0 right-0 p-6">
//                   <h3 className="text-white font-bold text-lg mb-1">{image.title}</h3>
//                   <div className="flex items-center text-yellow-400 text-sm mb-2">
//                     <MapPin className="w-4 h-4 mr-1" />
//                     {image.location}
//                   </div>
//                   <p className="text-gray-200 text-sm">{image.description}</p>
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
//                 className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
//               >
//                 <X className="w-6 h-6" />
//               </button>

//               {/* Navigation Buttons */}
//               <button
//                 onClick={prevImage}
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>

//               {/* Image */}
//               <img
//                 src={filteredImages[selectedImage].src}
//                 alt={filteredImages[selectedImage].alt}
//                 className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   console.error('Failed to load lightbox image:', filteredImages[selectedImage].src);
//                   target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY5NzM4MyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
//                   target.alt = 'Image not found';
//                 }}
//               />

//               {/* Image Info */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
//                 <h3 className="text-2xl font-bold mb-2">{filteredImages[selectedImage].title}</h3>
//                 <div className="flex items-center mb-2 text-gray-300">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   {filteredImages[selectedImage].location}
//                 </div>
//                 <p className="text-gray-200">{filteredImages[selectedImage].description}</p>
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
import { galleryImages, type LocalizedGalleryText } from '../data/galleryData';

interface GalleryImage {
  id: string;
  src: string;
  alt: LocalizedGalleryText;
  title: LocalizedGalleryText;
  location: LocalizedGalleryText;
  description: LocalizedGalleryText;
  category: string;
}

export const Gallery: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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
    <section id="gallery" className="py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 mb-12">
          <div>
            <p className="eyebrow mb-3">{(t.gallery as any).eyebrow}</p>
            <h2 className="display-md text-ink" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {t.gallery.title}
            </h2>
          </div>
          <div className="hidden md:block self-end">
            <div className="hairline-strong w-full" />
            <p className="meta uppercase tracking-[0.2em] mt-3">{t.gallery.subtitle}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {Object.entries(t.gallery.categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 font-mono uppercase text-[11px] tracking-[0.18em] border transition-colors ${
                selectedCategory === key
                  ? 'border-ink bg-ink text-paper'
                  : 'border-[rgba(26,22,18,0.32)] text-ink-soft hover:border-ink hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden border border-[rgba(26,22,18,0.32)] bg-paper p-2 cursor-pointer transition-all hover:border-ink"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt[currentLanguage as keyof LocalizedGalleryText]}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ filter: 'sepia(8%) contrast(1.02)' }}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('Failed to load image:', image.src, 'Full URL:', window.location.origin + image.src);
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY5NzM4MyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+KCR7aW1hZ2Uuc3JjfSk8L3RleHQ+PC9zdmc+';
                  target.alt = 'Image not found';
                }}
              />
              {/* Plate caption (always visible) */}
              <div className="flex items-baseline justify-between pt-3 px-1 pb-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
                <span>Plate {String(index + 1).padStart(2, '0')}</span>
                <span className="text-ink-soft">{image.location[currentLanguage as keyof LocalizedGalleryText]}</span>
              </div>
              {/* Hover panel — paper, not black */}
              <div className="absolute inset-2 bg-paper/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <h3 className="display-sm text-ink mb-2" style={{ fontSize: '20px', fontVariationSettings: '"opsz" 24, "wght" 500' }}>
                  {image.title[currentLanguage as keyof LocalizedGalleryText]}
                </h3>
                <div className="flex items-center gap-1.5 meta uppercase tracking-[0.22em] mb-2">
                  <MapPin className="w-3 h-3" />
                  {image.location[currentLanguage as keyof LocalizedGalleryText]}
                </div>
                <p className="text-[13px] text-ink-soft leading-relaxed">{image.description[currentLanguage as keyof LocalizedGalleryText]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-ink/95 z-[60] flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              {/* Close */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 font-mono uppercase text-[11px] tracking-[0.22em] text-paper hover:text-sulfur border border-paper/40 hover:border-sulfur transition-colors"
              >
                <X className="w-3 h-3 inline-block mr-1" /> Close
              </button>

              {/* Nav */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-paper hover:text-sulfur transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-paper hover:text-sulfur transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt[currentLanguage as keyof LocalizedGalleryText]}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('Failed to load lightbox image:', filteredImages[selectedImage].src, 'Full URL:', window.location.origin + filteredImages[selectedImage].src);
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY5NzM4MyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                  target.alt = 'Image not found';
                }}
              />

              {/* Caption strip */}
              <div className="mt-4 px-2 text-paper">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-mono uppercase text-[10px] tracking-[0.22em] text-paper/60">
                    Plate {String(selectedImage + 1).padStart(2, '0')} / {filteredImages.length}
                  </span>
                  <span className="font-mono uppercase text-[10px] tracking-[0.22em] text-paper/60 inline-flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {filteredImages[selectedImage].location[currentLanguage as keyof LocalizedGalleryText]}
                  </span>
                </div>
                <h3 className="font-display text-paper" style={{ fontSize: '24px', fontVariationSettings: '"opsz" 36, "wght" 480' }}>
                  {filteredImages[selectedImage].title[currentLanguage as keyof LocalizedGalleryText]}
                </h3>
                <p className="text-paper/70 text-[14px] mt-1.5 max-w-[72ch]">
                  {filteredImages[selectedImage].description[currentLanguage as keyof LocalizedGalleryText]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};