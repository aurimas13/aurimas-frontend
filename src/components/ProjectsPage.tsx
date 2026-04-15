import React from 'react';
import { Link } from 'react-router-dom';
import { Code, ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectLinks = [
  { slug: 'cleartrace', url: 'https://cleartrace-intelligence.vercel.app', color: 'from-blue-500 to-cyan-500' },
  { slug: 'aegis', url: 'https://aegis-ai-enterprise.vercel.app', color: 'from-purple-500 to-indigo-500' },
  { slug: 'gateway', url: 'https://ai-gateway-poc.vercel.app', color: 'from-amber-500 to-orange-500' },
  { slug: 'agentic', url: 'https://b2b-mobile-agent.vercel.app', color: 'from-green-500 to-emerald-500' },
];

export const ProjectsPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const projects = (t.projects as any).items;

  return (
    <section className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.projects.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t.projects.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectLinks.map((project) => {
            const item = projects[project.slug];
            return (
              <div key={project.slug} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className={`h-2 bg-gradient-to-r ${project.color}`}></div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-500">{item.tagline}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      {t.projects.viewProject} <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {t.projects.viewCaseStudy} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
