import React from 'react';
import { ToolCategory } from '../../types';
import { CATEGORIES, TOOLS_DATA } from '../../data/toolsData';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { IconHelper } from '../common/IconHelper';
import { SEOHead } from '../common/SEOHead';
import { AdPlaceholder } from '../layout/AdPlaceholder';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface CategoryPageProps {
  category: ToolCategory;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const catInfo = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Tools`,
    description: `Free, private online ${category} tools for everyday tasks.`,
    icon: 'Wrench',
  };

  const tools = TOOLS_DATA.filter((t) => t.category === category);
  const breadcrumbs = [
    { name: catInfo.name, url: `/category/${category}`, current: true },
  ];

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <SEOHead
        title={`${catInfo.name} - Free Online Utilities | QuickToolKit`}
        description={catInfo.description}
        canonicalUrl={`https://quicktoolkit.com/category/${category}`}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <header className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <IconHelper name={catInfo.icon} className="h-3.5 w-3.5" />
            <span>Category Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {catInfo.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {catInfo.description} Every utility runs directly in your browser without uploading your files to remote servers.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>100% Client-Side Processing • No Account Required</span>
          </div>
        </header>

        <AdPlaceholder slotId="cat-top-banner" format="horizontal" />

        {/* Category Tools Grid */}
        <section className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onNavigate(`/${tool.slug}`)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconHelper name={tool.iconName} className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Open Tool</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </section>

        {/* Informative Category Overview Content */}
        <section className="my-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs prose prose-slate max-w-none text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-3">
            Why Choose QuickToolKit for {catInfo.name}?
          </h2>
          <p className="text-sm sm:text-base mb-4">
            Most online {category} utilities force users to endure slow upload queues, invasive full-screen video ads, or restrictive file quotas. QuickToolKit takes a radically different engineering approach by shifting computation directly to the client browser.
          </p>
          <p className="text-sm sm:text-base">
            Whether you are on a metered mobile connection or handling confidential documents, our browser-native toolset delivers desktop-grade performance without sending a single byte to external servers.
          </p>
        </section>
      </div>
    </div>
  );
};
