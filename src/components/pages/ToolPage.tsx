import React from 'react';
import { ToolDefinition } from '../../types';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { AdPlaceholder } from '../layout/AdPlaceholder';
import { FAQAccordion } from '../common/FAQAccordion';
import { SEOHead } from '../common/SEOHead';
import { IconHelper } from '../common/IconHelper';
import { TOOLS_DATA } from '../../data/toolsData';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, FileCheck, Layers } from 'lucide-react';

// Tool Components
import { ImageCompressorTool } from '../tools/ImageCompressorTool';
import { ImageResizerTool } from '../tools/ImageResizerTool';
import { ImageConverterTool } from '../tools/ImageConverterTool';
import { JpgToPdfTool } from '../tools/JpgToPdfTool';
import { PdfToJpgTool } from '../tools/PdfToJpgTool';
import { WordCounterTool } from '../tools/WordCounterTool';
import { CaseConverterTool } from '../tools/CaseConverterTool';
import { RemoveDuplicateLinesTool } from '../tools/RemoveDuplicateLinesTool';
import { ColorPaletteGeneratorTool } from '../tools/ColorPaletteGeneratorTool';
import { JsonFormatterTool } from '../tools/JsonFormatterTool';

interface ToolPageProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, onNavigate }) => {
  const canonicalUrl = `https://gamersign94-svg.github.io/quicktoolkit/${tool.slug}`;

  const renderToolComponent = () => {
    switch (tool.slug) {
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'image-resizer':
        return <ImageResizerTool />;
      case 'image-converter':
        return <ImageConverterTool />;
      case 'jpg-to-pdf':
        return <JpgToPdfTool />;
      case 'pdf-to-jpg':
        return <PdfToJpgTool />;
      case 'word-counter':
        return <WordCounterTool />;
      case 'case-converter':
        return <CaseConverterTool />;
      case 'remove-duplicate-lines':
        return <RemoveDuplicateLinesTool />;
      case 'color-palette-generator':
        return <ColorPaletteGeneratorTool />;
      case 'json-formatter':
        return <JsonFormatterTool />;
      default:
        return <div>Tool coming soon...</div>;
    }
  };

  const breadcrumbs = [
    { name: `${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools`, url: `/category/${tool.category}` },
    { name: tool.title, url: `/${tool.slug}`, current: true },
  ];

  const relatedTools = TOOLS_DATA.filter((t) => tool.relatedToolSlugs.includes(t.slug));

  return (
    <article className="min-h-screen py-6 sm:py-10">
      <SEOHead
        title={tool.metaTitle}
        description={tool.metaDesc}
        canonicalUrl={canonicalUrl}
        tool={tool}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        {/* Header & Introduction Section */}
        <header className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <IconHelper name={tool.iconName} className="h-3.5 w-3.5" />
            <span>{tool.category} Tool</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {tool.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {tool.intro}
          </p>

          {/* Privacy Guarantee Pill */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{tool.privacyNote}</span>
          </div>
        </header>

        {/* Ad Placement: Below Header */}
        <AdPlaceholder slotId="tool-top-banner" format="horizontal" />

        {/* Interactive Tool Interface */}
        <section aria-label={`${tool.title} interface`} className="my-8">
          {renderToolComponent()}
        </section>

        {/* Ad Placement: Below Tool */}
        <AdPlaceholder slotId="tool-middle-banner" format="horizontal" />

        {/* Step-by-Step How-To Section */}
        <section className="my-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            How to Use the {tool.title}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Follow these simple steps to process your file directly in your browser.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tool.howToSteps.map((step) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 flex flex-col justify-start"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-sm mb-3">
                  {step.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features & Benefits Grid */}
        <section className="my-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Key Features of QuickToolKit {tool.title}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Engineered for high performance, ease of use, and local privacy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 font-medium leading-normal">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Original Explanatory Content (500-900 words) */}
        <section className="my-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs prose prose-slate max-w-none text-slate-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-4">
            About {tool.title} & In-Browser Processing
          </h2>
          
          <p className="text-sm sm:text-base mb-4">
            In modern web computing, processing files locally offers profound advantages over traditional cloud converters. When you utilize the <strong>{tool.title}</strong> on QuickToolKit, the computational load is performed directly by your device's native JavaScript runtime, HTML5 Canvas engine, and modern browser APIs.
          </p>

          <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">
            Why Local Browser Processing Matters
          </h3>
          <p className="text-sm sm:text-base mb-4">
            Traditional online utilities force you to transmit sensitive documents, private photographs, or proprietary JSON configurations to remote servers. This introduces three critical drawbacks:
          </p>
          <ul className="space-y-2 text-sm sm:text-base list-disc pl-5 mb-6">
            <li><strong>Privacy Vulnerabilities:</strong> Storing uploaded files in external server buckets exposes your information to third-party data breaches and unauthorized retention. QuickToolKit eliminates this risk by keeping 100% of data execution inside your device's browser memory.</li>
            <li><strong>Bandwidth and Latency:</strong> Uploading multi-megabyte files over mobile networks or congested connections wastes time and data. With QuickToolKit, processing starts instantaneously with zero network latency.</li>
            <li><strong>Zero Cost and No Paywalls:</strong> Because QuickToolKit avoids costly cloud computing clusters and server storage, we offer all 10 tools entirely free without subscriptions or watermarks.</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">
            Common Use Cases
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose my-4">
            {tool.useCases.map((uc, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs sm:text-sm text-slate-800 font-medium">
                <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{uc}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">
            Supported File Formats
          </h3>
          <div className="flex flex-wrap gap-2 not-prose my-3">
            {tool.supportedFormats.map((fmt) => (
              <span key={fmt} className="rounded-lg bg-blue-100 text-blue-800 font-semibold px-3 py-1 text-xs">
                {fmt}
              </span>
            ))}
          </div>
        </section>

        {/* Ad Placement: Before FAQ */}
        <AdPlaceholder slotId="tool-pre-faq-banner" format="horizontal" />

        {/* Frequently Asked Questions */}
        <FAQAccordion faqs={tool.faqs} title={`${tool.title} FAQs`} />

        {/* Related Tools Internal Linking */}
        {relatedTools.length > 0 && (
          <section className="my-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Related Online Tools
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Explore other fast, free utilities in our collection.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/')}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all tools</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`/${rel.slug}`)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconHelper name={rel.iconName} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {rel.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {rel.shortDesc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Use Tool</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};
