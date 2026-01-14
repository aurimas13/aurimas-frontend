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
    { name: currentLanguage === 'lt' ? 'Vadovavimas' : currentLanguage === 'fr' ? 'Leadership' : 'Leadership', level: 100, color: 'bg-green-200' },
    { name: currentLanguage === 'lt' ? 'Bendravimas' : currentLanguage === 'fr' ? 'Communication' : 'Communication', level: 100, color: 'bg-cyan-200' },
    { name: currentLanguage === 'lt' ? 'Chemija' : currentLanguage === 'fr' ? 'Chimie' : 'Chemistry', level: 100, color: 'bg-blue-200' },
    { name: currentLanguage === 'lt' ? 'Komandinis darbas' : currentLanguage === 'fr' ? 'Travail d\'équipe' : 'Teamwork', level: 100, color: 'bg-orange-200' },
    { name: currentLanguage === 'lt' ? 'Vadyba' : currentLanguage === 'fr' ? 'Gestion' : 'Management', level: 100, color: 'bg-purple-200' },
    { name: currentLanguage === 'lt' ? 'Mokymas' : currentLanguage === 'fr' ? 'Enseignement' : 'Teaching', level: 100, color: 'bg-pink-200' },
    { name: currentLanguage === 'lt' ? 'Programavimas' : currentLanguage === 'fr' ? 'Programmation' : 'Programming', level: 90, color: 'bg-indigo-200' }
  ];


  return (
    <section id="about" className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25">
      <div className="w-screen px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.about.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Bio Section */}
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
                  onClick={() => handlePDFDownload('/Aurimas_Nausedas_Resume_2026_January_One_Page.pdf', 'Aurimas_Nausedas_CV_English.pdf')}
                  className="bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (EN)</span>
                </button>
                <button
                  onClick={() => handlePDFDownload('/CV_Aurimas_Sausis_2026_vienas_lapas.pdf', 'Aurimas_Nausedas_CV_Lithuanian.pdf')}
                  className="bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (LT)</span>
                </button>
                <button
                  onClick={() => handlePDFDownload('/CV_Aurimas_2026_janvier_une_feuille.pdf', 'Aurimas_Nausedas_CV_French.pdf')}
                  className="bg-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-800"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.about.download} (FR)</span>
                </button>
              </div>
                </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="space-y-8">
            {/* Skills */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <Code className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">{t.about.skills}</h3>
              </div>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">{skill.name}</span>
                      <span className="text-gray-500 text-sm sm:text-base">{skill.level}%</span>
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
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-yellow-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">{t.about.experience}</h3>
              </div>
              <div className="space-y-4">
                {/* Teacher */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Mokytojas' : 
                     currentLanguage === 'fr' ? 'Enseignant' : 
                     'Teacher'}
                  </h4>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">
                    {currentLanguage === 'lt' ? 
                      'Mokiau kompiuterių mokslų, dirbtinio intelekto, chemijos ir biologijos teorijos, pagrindų ir taikymų. Teikiau medžiagą. Vertinau. Daugiau nei 3 metų patirtis.' :
                     currentLanguage === 'fr' ? 
                      'Enseignement de la théorie, des principes fondamentaux et des applications de l\'informatique, de l\'intelligence artificielle, de la chimie et de la biologie. Fourniture du matériel pédagogique. Notation des travaux. Plus de 3 ans d\'expérience.' :
                      'Taught theory, fundamentals, and applications of Computer Science, Artificial Intelligence, Chemistry, and Biology. Provided the material. Graded. Over 3 years of experience.'}
                  </p>
                </div>
                {/* Manager */}
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Vadybininkas' : 
                     currentLanguage === 'fr' ? 'Responsable' : 
                     'Manager'}
                  </h4>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">
                    {currentLanguage === 'lt' ? 
                      '5 projektai. Techninių, komunikacijos ir pardavimo komandų valdymas. Daugiau nei 3 metų patirtis.' :
                     currentLanguage === 'fr' ? 
                      '5 projets à son actif. Gestion des équipes techniques, communicationnelles et commerciales. Plus de 3 ans d\'expérience.' :
                      '5 projects under the belt. Handling management over technical, communicational, and sales teams. Over 3 years of experience.'}
                  </p>
                </div>
                {/* AI Architect & Leader */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'DI architektas ir vadovas' : 
                     currentLanguage === 'fr' ? 'Architecte et responsable IA' : 
                     'AI Architect & Leader'}
                  </h4>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">
                    {currentLanguage === 'lt' ? 
                      'Specializuojuosi dirbtinio intelekto srityje. Vadovavau techninėms, verslo, mokslo ir švietimo komandoms. Dirbau su suinteresuotosiomis šalimis. Turiu didelį IT, verslo, mokslo ir komunikacijos žinių bagažą. Daugiau nei 5 metų patirtis.' :
                     currentLanguage === 'fr' ? 
                      'Spécialisé en intelligence artificielle. A dirigé des équipes techniques, commerciales, scientifiques et pédagogiques. A travaillé avec des parties prenantes. Vaste arsenal en matière d\'informatique, de commerce, de sciences et de communication. Plus de 5 ans d\'expérience.' :
                      'Specialize in Artificial Intelligence. Led technical, business, scientific, and educational teams. Worked with stakeholders. A huge arsenal of IT, business, science, and communication. Over 5 years of experience.'}
                  </p>
                </div>
                {/* Research Engineer */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Tyrimų inžinierius' : 
                     currentLanguage === 'fr' ? 'Ingénieur de recherche' : 
                     'Research Engineer'}
                  </h4>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">
                    {currentLanguage === 'lt' ? 
                      'Chemikas, turintis tyrimų patirties Europoje ir Jungtinėse Valstijose. Dirbau fizikinės, organinės, kompiuterinės chemijos, molekulinio modeliavimo ir statistikos srityse. 12 metų patirtis.' :
                     currentLanguage === 'fr' ? 
                      'Chimiste ayant mené des recherches en Europe et aux États-Unis. Travaille dans les domaines de la chimie physique, organique et computationnelle, de la modélisation moléculaire et des statistiques. 12 ans d\'expérience.' :
                      'A chemist with research under the belt spanning Europe and the United States. Work with physical, organic, computational chemistry, molecular modeling, and statistics. 12 years of experience.'}
                  </p>
                </div>
                {/* Developer */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Kūrėjas' : 
                     currentLanguage === 'fr' ? 'Développeur' : 
                     'Developer'}
                  </h4>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">
                    {currentLanguage === 'lt' ? 
                      'Kūriau mažų ir didelių įmonių verslo sprendimus. Nuo duomenų intuicijos iki diegimo. Prižiūrėjau. Daugiau nei 12 metų patirtis.' :
                     currentLanguage === 'fr' ? 
                      'A conçu des solutions pour les petites entreprises et les grandes sociétés. Les a supervisées depuis l\'intuition des données jusqu\'au déploiement. A supervisé. Plus de 12 ans d\'expérience.' :
                      'Constructed small business and enterprise solutions. Looked over them from data intuition to deployment. Looked over. Over 12 years of experience.'}
                  </p>
                </div>
                {/* Writer */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-bold text-gray-800">
                    {currentLanguage === 'lt' ? 'Rašytojas' : 
                     currentLanguage === 'fr' ? 'Rédacteur' : 
                     'Writer'}
                  </h4>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">
                    {currentLanguage === 'lt' ? 
                      'Techniniai, meniniai ir moksliniai raštai. Poezija. Daugiau nei 15 metų patirtis.' :
                     currentLanguage === 'fr' ? 
                      'Rédaction technique, artistique et scientifique. Poésie. Plus de 15 ans d\'expérience.' :
                      'Technical, artistic, and scientific writing. Poetry. Over 15 years of experience.'}
                  </p>
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