import React from 'react';
import { Code, Beaker, BookOpen, Award, Download } from 'lucide-react';
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

  const skills = [
    { name: currentLanguage === 'lt' ? 'Dirbtinis intelektas' : currentLanguage === 'fr' ? 'Intelligence artificielle' : 'Artificial Intelligence', level: 100, color: 'bg-yellow-200' },
    { name: currentLanguage === 'lt' ? 'Mašininis mokymasis' : currentLanguage === 'fr' ? 'Apprentissage automatique' : 'Machine Learning', level: 100, color: 'bg-green-200' },
    { name: currentLanguage === 'lt' ? 'Chemija' : currentLanguage === 'fr' ? 'Chimie' : 'Chemistry', level: 100, color: 'bg-cyan-200' },
    { name: 'Python', level: 95, color: 'bg-blue-200' },
    { name: 'Java', level: 90, color: 'bg-orange-200' },
    { name: currentLanguage === 'lt' ? 'Duomenų mokslas' : currentLanguage === 'fr' ? 'Science des données' : 'Data Science', level: 90, color: 'bg-purple-200' },
    { name: 'JavaScript/TypeScript', level: 85, color: 'bg-pink-200' },
    { name: 'C++', level: 80, color: 'bg-indigo-200' }
  ];


  return (
    <section id="about" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.about.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">{t.about.myStory}</h3>
              </div>
              <div className="prose prose-gray max-w-none">
                {t.about.bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white text-center">
              <h4 className="text-xl font-bold mb-2">{t.about.downloadCVShort}</h4>
              <p className="mb-4">{t.about.downloadDescription}</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => handlePDFDownload('/Aurimas_Nausedas_Resume_2025_July.pdf', 'Aurimas_Nausedas_CV_English.pdf')}
                  className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (EN)</span>
                </button>
                <button
                  onClick={() => handlePDFDownload('/CV_Aurimas_Liepa.pdf', 'Aurimas_Nausedas_CV_Lithuanian.pdf')}
                  className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (LT)</span>
                </button>
                <button
                  onClick={() => handlePDFDownload('/CV_Aurimas_Juillet.pdf', 'Aurimas_Nausedas_CV_French.pdf')}
                  className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (FR)</span>
                </button>
              </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <Code className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">{t.about.skills}</h3>
              </div>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Highlights */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-yellow-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">{t.about.experience}</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'DI architektas' : 
                     currentLanguage === 'fr' ? 'Architecte IA' : 
                     'AI Architect'}
                  </h4>
                  <p className="text-gray-600">
                    {currentLanguage === 'lt' ? '2022 - Dabar' : 
                     currentLanguage === 'fr' ? '2022 - présent' : 
                     '2022 - Present'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {currentLanguage === 'lt' ? 
                      'Specializuojuosi dirbtinio intelekto ruošimo ir sprendimų architektūroje, mašininio mokymosi sistemų kūrime bei duomenų mokslo projektų vadovavime. Dirbu su įvairiomis technologijomis: Python, TensorFlow, PyTorch, bei debesų platformomis.' :
                     currentLanguage === 'fr' ? 
                      'Spécialisé dans l\'architecture de solutions IA, la préparation et le développement de systèmes d\'apprentissage automatique et la direction de projets en science des données. Travaille avec diverses technologies, notamment Python, TensorFlow, PyTorch et les plateformes cloud.' :
                      'Specialized in AI solution architecture, machine learning system preparation and development, and data science project leadership. Working with diverse technologies including Python, TensorFlow, PyTorch, and cloud platforms.'}
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Mokslo tyrėjas' : 
                     currentLanguage === 'fr' ? 'Chercheur scientifique' : 
                     'Scientific Researcher'}
                  </h4>
                  <p className="text-gray-600">
                    {currentLanguage === 'lt' ? 'Edinburgo universitetas ir kitos mokslinės įstaigos' : 
                     currentLanguage === 'fr' ? 'Université d\'Édimbourg et autres' : 
                     'University of Edinburgh & Others'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {currentLanguage === 'lt' ? 
                      'Patirtis mokslinių tyrimų srityje, įskaitant kompiuterinę chemiją, molekulinį modeliavimą, duomenų analizę, biochemiją ir mokslinių straipsnių rengimą. Dalyvavimas tarptautiniuose projektuose ir konferencijose.' :
                     currentLanguage === 'fr' ? 
                      'Expérience en recherche scientifique, notamment en chimie computationnelle, modélisation moléculaire, analyse de données et rédaction d\'articles scientifiques. Participation à des projets et conférences internationaux.' :
                      'Experience in scientific research, including computational chemistry, molecular modeling, data analysis, and scientific publication writing. Participation in international projects and conferences.'}
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Savanoris' : 
                     currentLanguage === 'fr' ? 'Bénévole' : 
                     'Volunteer'}
                  </h4>
                  <p className="text-gray-600">
                    {currentLanguage === 'lt' ? 'Įvairios organizacijos ir projektai' : 
                     currentLanguage === 'fr' ? 'Diverses organisations et projets' : 
                     'Various Organizations & Projects'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {currentLanguage === 'lt' ? 
                      'Įvairi veiklos patirtis, įskaitant mokslo švietimą bendruomenėje, mentorystę programavimo srityje, tyrimų pagalbą universitetuose, dalyvavimą STEM skatinimo programose, dirbtinio intelekto programų kūrime ir rankų darbų reikalaujančiose veiklose.' :
                     currentLanguage === 'fr' ? 
                      'Expérience bénévole dans les domaines suivants : éducation scientifique communautaire, mentorat en programmation, assistance à la recherche universitaire, participation à des programmes de promotion des STEM, aide à des tâches manuelles et développement de programmes d\'IA.' :
                      'Volunteer experience including community science education, programming mentorship, university research assistance, participation in STEM promotion programs, manual labour assistance, and AI program developments.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};