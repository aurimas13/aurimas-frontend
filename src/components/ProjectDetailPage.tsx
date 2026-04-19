import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle, Github, Briefcase, Wrench, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';

const projectMeta: Record<string, { url: string; github: string; color: string; accent: string }> = {
  cleartrace: { url: 'https://cleartrace.aurimas.io', github: 'https://github.com/aurimas13/ClearTrace', color: 'from-blue-500 to-cyan-500', accent: 'blue' },
  aegis: { url: 'https://aegis.aurimas.io', github: 'https://github.com/aurimas13/Aegis_AI', color: 'from-purple-500 to-indigo-500', accent: 'purple' },
  gateway: { url: 'https://gateway.aurimas.io', github: 'https://github.com/aurimas13/AI_Platform', color: 'from-amber-500 to-orange-500', accent: 'amber' },
  agentic: { url: 'https://agentic.aurimas.io', github: 'https://github.com/aurimas13/web_application', color: 'from-green-500 to-emerald-500', accent: 'green' },
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium mb-4">
              <Briefcase className="w-3.5 h-3.5" />
              {t.projects.caseStudyLabel}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{item.name}</h1>
            <p className="text-lg text-gray-500 mb-4">{item.tagline}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
              >
                {t.projects.viewProject} <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors shadow-sm"
              >
                <Github className="w-4 h-4 mr-2" /> {t.projects.viewSource}
              </a>
            </div>
          </div>
        </div>

        {/* Case Study */}
        <div className="space-y-6">
          {/* Problem */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold mr-3">
                <AlertCircle className="w-4 h-4" />
              </span>
              {t.projects.problem}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.problem}</p>
          </div>

          {/* Approach */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                <Lightbulb className="w-4 h-4" />
              </span>
              {t.projects.approach}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.approach}</p>
          </div>

          {/* My Role */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold mr-3">
                <Briefcase className="w-4 h-4" />
              </span>
              {t.projects.myRole}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.role}</p>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-bold mr-3">
                <Wrench className="w-4 h-4" />
              </span>
              {t.projects.techStack}
            </h2>
            <div className="flex flex-wrap gap-2">
              {item.tech.map((tech: string) => (
                <span key={tech} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold mr-3">
                <Target className="w-4 h-4" />
              </span>
              {t.projects.outcome}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {item.metrics.map((m: { value: string; label: string }) => (
                <div key={m.label} className={`rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 text-center`}>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{m.value}</p>
                  <p className="text-xs text-gray-500">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">{item.outcome}</p>
          </div>

          {/* What's Novel */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold mr-3">
                <TrendingUp className="w-4 h-4" />
              </span>
              {t.projects.whatsNovel}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.novel}</p>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t.projects.liveDemo}</h2>
            <p className="text-gray-500 text-sm mb-6">{t.projects.exploreLive}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg"
              >
                {t.projects.viewProject} <ExternalLink className="w-5 h-5 ml-2" />
              </a>
              <a
                href={meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-all shadow-md hover:shadow-lg"
              >
                <Github className="w-5 h-5 mr-2" /> {t.projects.viewSource}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
