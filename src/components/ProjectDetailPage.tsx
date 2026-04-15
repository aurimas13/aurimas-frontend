import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle, Camera } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectMeta: Record<string, { url: string; color: string }> = {
  cleartrace: { url: 'https://cleartrace-intelligence.vercel.app', color: 'from-blue-500 to-cyan-500' },
  aegis: { url: 'https://aegis-ai-enterprise.vercel.app', color: 'from-purple-500 to-indigo-500' },
  gateway: { url: 'https://ai-gateway-poc.vercel.app', color: 'from-amber-500 to-orange-500' },
  agentic: { url: 'https://b2b-mobile-agent.vercel.app', color: 'from-green-500 to-emerald-500' },
};

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const projects = (t.projects as any).items;

  if (!slug || !projects[slug]) {
    return (
      <section className="py-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Project not found</h1>
          <Link to="/projects" className="text-amber-600 hover:text-amber-700 font-medium">
            {t.projects.backToProjects}
          </Link>
        </div>
      </section>
    );
  }

  const item = projects[slug];
  const meta = projectMeta[slug];

  return (
    <section className="py-20 bg-gradient-to-br from-lime-25 to-yellow-25 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> {t.projects.backToProjects}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className={`h-3 bg-gradient-to-r ${meta.color}`}></div>
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{item.name}</h1>
            <p className="text-lg text-gray-500 mb-4">{item.tagline}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
            >
              {t.projects.viewProject} <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        {/* Case Study */}
        <div className="space-y-6">
          {/* Problem */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold mr-3">1</span>
              {t.projects.problem}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.problem}</p>
          </div>

          {/* Approach */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">2</span>
              {t.projects.approach}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.approach}</p>
          </div>

          {/* Outcome */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold mr-3">3</span>
              {t.projects.outcome}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.outcome}</p>
          </div>

          {/* Screenshots placeholder */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <Camera className="w-5 h-5 text-gray-500 mr-3" />
              {t.projects.screenshots}
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">{t.projects.screenshotsPlaceholder}</p>
            </div>
          </div>

          {/* Live Demo link */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.projects.liveDemo}</h2>
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg"
            >
              {t.projects.viewProject} <ExternalLink className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
