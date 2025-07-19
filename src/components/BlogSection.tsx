import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import { blogCategories } from '../data/blogCategories';

interface BlogSectionProps {
  onManageBlog: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onManageBlog }) => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <section id="blogs" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.blogs.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.blogs.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t.blogs.allBlogs}
          </button>
          <button 
            onClick={onManageBlog}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t.blogs.manageBlog}
          </button>
        </div>

        {/* Blog Posts Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-200 relative overflow-hidden">
            {/* Background decoration - yellow theme */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-100 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 text-center text-gray-800">
              <h3 className="text-3xl font-bold mb-4 text-gray-800">
                🚀 {t.blogs.comingSoon}
              </h3>
              <p className="text-xl mb-6 text-gray-600">
                {t.blogs.comingSoonSubtitle}
              </p>
              
              {/* Preview cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">🧪</div>
                  <h4 className="font-bold text-sm text-gray-800">{t.blogs.aiChemistry}</h4>
                  <p className="text-xs text-gray-600">{t.blogs.aiChemistryDesc}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">💡</div>
                  <h4 className="font-bold text-sm text-gray-800">{t.blogs.careerTransitions}</h4>
                  <p className="text-xs text-gray-600">{t.blogs.careerTransitionsDesc}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-2xl mb-2">🌟</div>
                  <h4 className="font-bold text-sm text-gray-800">{t.blogs.personalGrowth}</h4>
                  <p className="text-xs text-gray-600">{t.blogs.personalGrowthDesc}</p>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="bg-yellow-100 rounded-lg p-6 border border-yellow-300">
                <h4 className="text-lg font-bold mb-3 text-gray-800">🔔 {t.blogs.beFirstToKnow}</h4>
                <p className="text-gray-600 mb-4">
                  {t.blogs.joinWaitlist}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <input 
                    type="email" 
                    placeholder={t.blogs.enterEmail}
                    className="px-4 py-2 rounded-lg bg-white text-gray-800 placeholder-gray-500 border border-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none flex-1 max-w-xs"
                  />
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-800 font-bold px-6 py-2 rounded-lg transition-colors transform hover:scale-105">
                    {t.blogs.joinWaitlistBtn}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t.blogs.noSpam}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Substack Publications - Smaller Section */}
        <div className="mb-12">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            {t.blogs.originalSubstack}
          </h4>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(blogCategories).map(([key, category]) => (
              <div key={key} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">
                  {category.title}
                </h5>
                <p className="text-gray-600 mb-3 text-xs">
                  {category.description}
                </p>
                <div className="mb-3">
                  <p className="text-xs text-gray-500">{category.languages}</p>
                </div>
                <a
                  href={category.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                >
                  {t.blogs.visitSubstack}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};