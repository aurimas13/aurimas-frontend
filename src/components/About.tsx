import React from 'react';
import { BookOpen, Download } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

export const About: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handlePDFDownload = async (pdfPath: string, filename: string) => {
    try {
      console.log(`Attempting to download: ${pdfPath}`);
      
      // Fetch the PDF as a blob to ensure proper handling
      const response = await fetch(pdfPath, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,*/*',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      console.log(`Content-Length: ${response.headers.get('content-length')}`);
      
      const blob = await response.blob();
      console.log(`Blob size: ${blob.size}, type: ${blob.type}`);
      
      // For TeXShop PDFs, ensure proper MIME type
      const pdfBlob = new Blob([blob], { 
        type: 'application/pdf'
      });
      
      // Create download link
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(pdfBlob);
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL after a delay to ensure download completes
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
      
      console.log(`Successfully downloaded: ${filename}`);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // TeXShop PDF fallback - try opening in new tab instead of download
      console.log('Trying fallback: opening in new tab');
      const newWindow = window.open(pdfPath, '_blank');
      if (!newWindow) {
        alert('Please allow popups to view the PDF, or try right-clicking the download button and selecting "Save link as..."');
      }
    }
  };



  return (
    <section id="about" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="w-screen px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.about.title}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">{t.about.myStory}</h3>
              </div>
              <div className="prose prose-gray max-w-none">
                {t.about.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-4 sm:p-6 text-white text-center">
              <h4 className="text-xl font-bold mb-2">{t.about.downloadCVShort}</h4>
              <p className="mb-4 text-sm sm:text-base">{t.about.downloadDescription}</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handlePDFDownload('/Aurimas_Resume_19042026_AI_Product_Manager.pdf', 'Aurimas_Nausedas_CV_English.pdf')}
                  className="bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (EN)</span>
                </button>
                <button
                  onClick={() => handlePDFDownload('/Aurimas_Resume_19042026_AI_Product_Manager_LT.pdf', 'Aurimas_Nausedas_CV_Lithuanian.pdf')}
                  className="bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (LT)</span>
                </button>
                <button
                  onClick={() => handlePDFDownload('/Aurimas_Resume_19042026_AI_Product_Manager_FR.pdf', 'Aurimas_Nausedas_CV_French.pdf')}
                  className="bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (FR)</span>
                </button>
              </div>
                </div>
            </div>
          </div>

        </div>
        </div>
      </div>
    </section>
  );
};