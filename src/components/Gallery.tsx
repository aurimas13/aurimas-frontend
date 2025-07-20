import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export const Gallery: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      src: '/1_Edinburgh.jpg',
      alt: 'Aurimas in Edinburgh',
      title: 'Edinburgh Adventures',
      location: 'Edinburgh, Scotland',
      description: 'Exploring the beautiful city of Edinburgh during my time at the University.'
    },
    {
      src: '/basketball.jpg',
      alt: 'Aurimas playing basketball',
      title: 'Basketball Passion',
      location: 'Local Court',
      description: 'Enjoying a game of basketball - one of my favorite ways to stay active and clear my mind.'
    },
    {
      src: '/gym.JPG',
      alt: 'Aurimas at the gym',
      title: 'Fitness Journey',
      location: 'Gym',
      description: 'Staying fit and healthy is essential for maintaining the energy needed for coding and writing.'
    },
    {
      src: '/high_lands_2.JPG',
      alt: 'Highland scenery',
      title: 'Highland Beauty',
      location: 'Scottish Highlands',
      description: 'The stunning landscapes of the Scottish Highlands that inspire my daily walks.'
    },
    {
      src: '/high_lands_3.jpeg',
      alt: 'More highland scenery',
      title: 'Mountain Views',
      location: 'Scottish Highlands',
      description: 'The breathtaking views remind me why I love living in Scotland.'
    },
    {
      src: '/sodyboj_1.JPG',
      alt: 'Aurimas at homestead',
      title: 'Homestead Life',
      location: 'Lithuanian Countryside',
      description: 'Connecting with my Lithuanian roots at the family homestead.'
    },
    {
      src: '/sodyboj_2.JPG',
      alt: 'More homestead photos',
      title: 'Rural Tranquility',
      location: 'Lithuanian Countryside',
      description: 'Finding peace and inspiration in the quiet countryside.'
    },
    {
      src: '/sun.JPG',
      alt: 'Sunset horizon',
      title: 'Golden Hour',
      location: 'Lake View',
      description: 'Capturing the perfect sunset - moments like these fuel my writing.'
    },
    {
      src: '/homestead_run.JPG',
      alt: 'Running at the homestead',
      title: 'Homestead Run',
      location: 'Lithuanian Countryside',
      description: 'Morning runs through the peaceful countryside, connecting with nature and my roots.'
    }
  ];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

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

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-lg">{image.title}</h3>
                  <div className="flex items-center text-sm opacity-90">
                    <MapPin className="w-4 h-4 mr-1" />
                    {image.location}
                  </div>
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
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Image */}
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold mb-2">{galleryImages[selectedImage].title}</h3>
                <div className="flex items-center mb-2 text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  {galleryImages[selectedImage].location}
                </div>
                <p className="text-gray-200">{galleryImages[selectedImage].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};