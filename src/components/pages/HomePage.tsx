import React, { useState } from 'react';
import { Search, Sparkles, Shield, Zap, Lock, Smartphone, CheckCircle, ArrowRight, HeartHandshake } from 'lucide-react';
import { TOOLS_DATA, CATEGORIES, GENERAL_FAQS } from '../../data/toolsData';
import { ToolCategory } from '../../types';
import { IconHelper } from '../common/IconHelper';
import { FAQAccordion } from '../common/FAQAccordion';
import { AdPlaceholder } from '../layout/AdPlaceholder';
import { SEOHead } from '../common/SEOHead';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ToolCategory>('all');
  const [inlineQuery, setInlineQuery] = useState('');

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      !inlineQuery ||
      tool.title.toLowerCase().includes(inlineQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(inlineQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(inlineQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularTools = TOOLS_DATA.filter((t) =>
    ['image-compressor', 'jpg-to-pdf', 'pdf-to-jpg', 'word-counter', 'json-formatter'].includes(t.slug)
  );

  return (
    <div className="min-h-screen">
      <SEOHead
        title="QuickToolKit - Free Online Tools for Images, PDF, Text & JSON"
        description="Free online tools for images, PDFs, text, color, and JSON. Fast, private, browser-based utilities with zero server uploads and no registration required."
        canonicalUrl="https://gamersign94-svg.github.io/quicktoolkit/"
        isHome={true}
        faqs={GENERAL_FAQS}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1.5 text-xs font-bold text-blue-700 mb-6 shadow-2xs">
            <Sparkles className="h-4 w-4" />
            <span>100% Free & Client-Side Private • No Server Uploads</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Free Online Tools for <span className="text-blue-600">Images, PDF, Text & JSON</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            QuickToolKit provides fast, free, and secure browser-based utilities for everyday digital tasks. Compress images, convert PDF pages, format JSON payloads, generate color schemes, and analyze text directly on your device with 100% client-side privacy.
          </p>

          {/* Large Hero Search Box */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200 p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="h-5 w-5 text-slate-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={inlineQuery}
                onChange={(e) => setInlineQuery(e.target.value)}
                placeholder="Search for a tool (e.g. compress, pdf, counter, json)..."
                className="w-full bg-transparent py-2.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
              />
              {inlineQuery ? (
                <button
                  onClick={() => setInlineQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <button
                  onClick={onOpenSearch}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              )}
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Popular:</span>
            {['Image Compressor', 'JPG to PDF', 'Word Counter', 'JSON Formatter'].map((name) => {
              const target = TOOLS_DATA.find((t) => t.title.toLowerCase().includes(name.toLowerCase()));
              return (
                <button
                  key={name}
                  onClick={() => target && onNavigate(`/${target.slug}`)}
                  className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad Space: Below Hero */}
      <AdPlaceholder slotId="home-top-banner" format="horizontal" />

      {/* Popular Tools Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Popular Tools
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                The most frequently used utilities by creators, writers, and developers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(`/${tool.slug}`)}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconHelper name={tool.iconName} className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 uppercase">
                      {tool.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {tool.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    Use Tool
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Tools Catalog with Category Tabs and H2 Category Headings */}
      <section className="py-16 bg-slate-50/60 border-t border-slate-200/70" id="all-tools">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Online Tool Suite ({TOOLS_DATA.length} Free Utilities)
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Browse our complete suite of browser-based utilities organized by category.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Categories ({TOOLS_DATA.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS_DATA.filter((t) => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search or Selected Category View */}
          {selectedCategory !== 'all' || inlineQuery ? (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {inlineQuery
                    ? `Search Results for "${inlineQuery}" (${filteredTools.length})`
                    : `${CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Filtered Tools'} (${filteredTools.length})`}
                </h2>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => onNavigate(`/category/${selectedCategory}`)}
                    className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    View Category Page <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {filteredTools.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                  <p className="text-base font-semibold text-slate-800">No tools matched your search</p>
                  <p className="text-xs text-slate-500 mt-1">Try another keyword or select a different category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onNavigate(`/${tool.slug}`)}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <IconHelper name={tool.iconName} className="h-5 w-5" />
                          </div>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
                            {tool.category}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {tool.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {tool.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                        <span>Use Tool</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Categorized Sections with semantic H2 headings */
            <div className="space-y-12">
              {CATEGORIES.map((cat) => {
                const toolsInCat = TOOLS_DATA.filter((t) => t.category === cat.id);
                if (toolsInCat.length === 0) return null;
                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/80 pb-3">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                          {cat.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                      <button
                        onClick={() => onNavigate(`/category/${cat.id}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 self-start sm:self-auto mt-1 sm:mt-0 cursor-pointer"
                      >
                        Explore {cat.name} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {toolsInCat.map((tool) => (
                        <div
                          key={tool.id}
                          onClick={() => onNavigate(`/${tool.slug}`)}
                          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <IconHelper name={tool.iconName} className="h-5 w-5" />
                              </div>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
                                {tool.category}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {tool.title}
                              </h3>
                              <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                                {tool.shortDesc}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Open {tool.title}</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Use QuickToolKit Section */}
      <section className="py-16 bg-white border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Why Use QuickToolKit?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Built from the ground up for privacy, speed, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">100% Free to Use</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero fees, zero subscriptions, and zero hidden limits. Every tool is available for unlimited personal and professional use.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Registration Required</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No email requests, no passwords, and no login walls. Jump straight into the utility you need with zero friction.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fast Browser-Based Processing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Operations execute directly on your CPU/GPU using modern Canvas and Web APIs, eliminating slow upload queues.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Privacy-Friendly</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your images, confidential contracts, and text snippets never leave your device. They are not stored or analyzed on any external server.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Mobile-First Responsiveness</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Designed to run flawlessly on smartphones, tablets, laptops, and desktop displays with responsive touch controls.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Watermarks</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All downloaded PDFs, images, and text outputs are clean and unbranded. Your files belong exclusively to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How QuickToolKit Works */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              How QuickToolKit Works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Three easy steps to complete everyday digital tasks in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Choose a Tool</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Select any of our 10 browser-based tools from the menu, category tabs, or instant search bar.
              </p>
            </div>

            <div className="relative text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Upload or Paste</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Drag and drop your file or paste your text. The tool processes everything locally in memory.
              </p>
            </div>

            <div className="relative text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Download or Copy</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Inspect the preview, download your optimized image or document, or copy the formatted text with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Space: Before FAQ */}
      <AdPlaceholder slotId="home-pre-faq" format="horizontal" />

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <FAQAccordion faqs={GENERAL_FAQS} title="Frequently Asked Questions" />
      </section>

      {/* About QuickToolKit & Useful Links Section */}
      <section className="py-16 bg-white border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  About QuickToolKit
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  QuickToolKit was built with a single mission: to provide fast, private, and dependable online tools for daily digital workflows without annoying paywalls, registration steps, or tracking. Whether you are optimizing photos with our <button onClick={() => onNavigate('/image-compressor')} className="text-blue-600 font-medium hover:underline cursor-pointer">Image Compressor</button>, converting documents with <button onClick={() => onNavigate('/jpg-to-pdf')} className="text-blue-600 font-medium hover:underline cursor-pointer">JPG to PDF</button>, analyzing copy with our <button onClick={() => onNavigate('/word-counter')} className="text-blue-600 font-medium hover:underline cursor-pointer">Word Counter</button>, or debugging payloads using the <button onClick={() => onNavigate('/json-formatter')} className="text-blue-600 font-medium hover:underline cursor-pointer">JSON Formatter</button>, your files stay entirely on your device.
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  We leverage HTML5 client-side APIs, WebAssembly, and local memory buffers so that your images and sensitive records never touch remote cloud servers.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  Quick Links & Policies
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li>
                    <button
                      onClick={() => onNavigate('/about')}
                      className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ArrowRight className="h-3.5 w-3.5" /> About Us & Our Mission
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('/contact')}
                      className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ArrowRight className="h-3.5 w-3.5" /> Contact Support & Feedback
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('/privacy-policy')}
                      className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ArrowRight className="h-3.5 w-3.5" /> Privacy Policy (100% Client-Side)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('/terms')}
                      className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ArrowRight className="h-3.5 w-3.5" /> Terms of Use
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('/disclaimer')}
                      className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <ArrowRight className="h-3.5 w-3.5" /> Disclaimer & Fair Use
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
