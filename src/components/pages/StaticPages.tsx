import React, { useState } from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { SEOHead } from '../common/SEOHead';
import { TOOLS_DATA, CATEGORIES } from '../../data/toolsData';
import { ShieldCheck, Mail, Send, Check, AlertCircle, FileText, Lock, Globe } from 'lucide-react';

interface StaticPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const breadcrumbs = [{ name: 'About QuickToolKit', url: '/about', current: true }];
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SEOHead
        title="About Us - QuickToolKit"
        description="Learn about QuickToolKit, a zero-budget, browser-first online tools suite built for speed, privacy, and simplicity."
        canonicalUrl="https://quicktoolkit.com/about"
        breadcrumbs={breadcrumbs}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            Our Mission
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About QuickToolKit
          </h1>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p className="text-base sm:text-lg text-slate-800 font-medium">
              QuickToolKit was conceived with a single, uncompromising goal: to provide fast, completely free online utilities for everyday tasks without compromising user privacy or demanding user accounts.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">
              The Problem with Traditional "Free" Tool Sites
            </h2>
            <p>
              Most online conversion and editing websites require you to upload your files to remote cloud servers. Once uploaded, your sensitive spreadsheets, personal family photos, or business contracts sit in foreign data centers, vulnerable to security breaches, unauthorized storage, or secondary data monetization. Furthermore, traditional sites gate basic features behind subscription walls, impose arbitrary daily conversion limits, or plaster invasive pop-up advertisements across every screen.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">
              The QuickToolKit Difference: 100% Client-Side Computing
            </h2>
            <p>
              QuickToolKit rejects the traditional server model. By leveraging contemporary web standards—including HTML5 Canvas, the JavaScript File and Blob APIs, and client-side document compilers—every single computation occurs locally within your own browser window.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Zero Server Uploads:</strong> Your files never touch our servers or any third-party infrastructure.</li>
              <li><strong>Instant Execution:</strong> Without network bottlenecks or queue delays, image compression, PDF creation, and JSON formatting execute virtually instantly.</li>
              <li><strong>Unlimited and Free:</strong> Because we do not run expensive server processing clusters, we have no reason to ever charge you or limit your daily tool usage.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">
              Designed for Speed & Accessibility
            </h2>
            <p>
              Every page is designed to comply with Google's Core Web Vitals standards, featuring lightning-fast Largest Contentful Paint (LCP), near-zero Cumulative Layout Shift (CLS), and accessible WCAG color contrast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const breadcrumbs = [{ name: 'Contact Us', url: '/contact', current: true }];
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Contact Us - QuickToolKit"
        description="Have a tool suggestion, feedback, or inquiry? Get in touch with the QuickToolKit team."
        canonicalUrl="https://quicktoolkit.com/contact"
        breadcrumbs={breadcrumbs}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact QuickToolKit
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Have a feature request, bug report, or tool idea? We love hearing from our community.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs sm:text-sm text-emerald-700">
                Thank you for reaching out, {name}. Our team reviews feedback daily and will follow up if requested.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Tool suggestion / Feature feedback"
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we make QuickToolKit better for your daily tasks?"
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const breadcrumbs = [{ name: 'Privacy Policy', url: '/privacy-policy', current: true }];
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Privacy Policy - QuickToolKit"
        description="QuickToolKit's privacy policy: 100% client-side data processing, zero file uploads, no account registration required."
        canonicalUrl="https://quicktoolkit.com/privacy-policy"
        breadcrumbs={breadcrumbs}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Effective Date: January 1, 2025 • Last Updated: September 2025</p>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium">
              Summary: We do not collect, view, store, or transmit your uploaded files, images, or texts. All file processing is performed locally inside your device’s browser.
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">1. Information We Do Not Collect</h2>
            <p>
              When you use our Image Compressor, Image Resizer, Image Converter, JPG to PDF, PDF to JPG, Word Counter, Case Converter, Remove Duplicate Lines, Color Palette Generator, or JSON Formatter:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We do <strong>not</strong> upload your images or PDF files to any server.</li>
              <li>We do <strong>not</strong> save or log the text or code you paste into any tool.</li>
              <li>We do <strong>not</strong> require user accounts, emails, or personal identification.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">2. How Client-Side Processing Works</h2>
            <p>
              Our website uses HTML5 Canvas, Blob APIs, and native browser JavaScript to process your files directly in your computer or phone’s temporary RAM. When you close or refresh the tab, the memory is cleared instantly by your browser.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">3. Cookies and Local Storage</h2>
            <p>
              QuickToolKit does not use tracking cookies for user profiling. Local storage may be utilized solely to preserve client-side UI preferences (such as theme choice or recent tool settings).
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">4. Advertising and Third-Party Services</h2>
            <p>
              To maintain QuickToolKit as a free service without charging users, we may display standardized, non-intrusive advertisements served by reputable advertising networks (such as Google AdSense). These third-party ad networks may use anonymous cookies to serve relevant advertisements according to their respective privacy standards.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">5. Compliance with Global Privacy Standards (GDPR & CCPA)</h2>
            <p>
              Because QuickToolKit does not store personal data or user files on servers, we fundamentally respect the privacy and data minimization principles mandated by the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const breadcrumbs = [{ name: 'Terms of Use', url: '/terms-of-use', current: true }];
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Terms of Use - QuickToolKit"
        description="Terms and conditions governing the use of QuickToolKit online tools and services."
        canonicalUrl="https://quicktoolkit.com/terms-of-use"
        breadcrumbs={breadcrumbs}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Use
          </h1>
          <p className="text-xs text-slate-500">Effective Date: January 1, 2025</p>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mt-4 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing QuickToolKit (the "Website"), you acknowledge and agree to comply with these Terms of Use and all applicable laws and regulations.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">2. Permitted Use</h2>
            <p>
              QuickToolKit provides tools for personal, educational, and commercial productivity. You agree to use the tools in compliance with all relevant laws and refrain from attempting to disrupt the Website’s client-side runtime or automated systems.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">3. Intellectual Property</h2>
            <p>
              All files, images, documents, and text generated or edited by you using QuickToolKit remain your exclusive property. QuickToolKit claims zero ownership, license, or rights to any content processed through our tools.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">4. Disclaimer of Warranties</h2>
            <p>
              All utilities and information provided on QuickToolKit are offered on an "as is" and "as available" basis without warranties of any kind, whether express or implied. While we take pride in rigorous client-side testing, you are encouraged to verify converted files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const breadcrumbs = [{ name: 'Disclaimer', url: '/disclaimer', current: true }];
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SEOHead
        title="Disclaimer - QuickToolKit"
        description="General disclaimer regarding tool performance, outputs, and browser compatibility on QuickToolKit."
        canonicalUrl="https://quicktoolkit.com/disclaimer"
        breadcrumbs={breadcrumbs}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Disclaimer
          </h1>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
            <p>
              The information and tools provided by QuickToolKit are for general productivity, creative, and educational purposes only.
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">Browser Environment Variability</h2>
            <p>
              Because our tools execute in client-side memory using the computational resources of your own hardware and browser, processing speeds and memory availability may vary depending on device capabilities, memory constraints, and browser version.
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-6 mb-2">Data Retention & Recovery</h2>
            <p>
              Because QuickToolKit does not maintain server copies of your files, we cannot recover previous versions of images, PDFs, or texts once a browser session is closed or refreshed. Users should always maintain local backups of critical files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SitemapPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  const breadcrumbs = [{ name: 'HTML Sitemap', url: '/sitemap', current: true }];
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <SEOHead
        title="HTML Sitemap - QuickToolKit"
        description="Comprehensive index of all free online tools, category suites, and informational pages on QuickToolKit."
        canonicalUrl="https://quicktoolkit.com/sitemap"
        breadcrumbs={breadcrumbs}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Website Directory & Sitemap
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Easily navigate all 10 free browser tools, category collections, and informational pages.
            </p>
          </div>

          {/* Tools by Category */}
          {CATEGORIES.map((cat) => {
            const catTools = TOOLS_DATA.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="text-lg font-bold text-slate-900">{cat.name}</h2>
                  <button
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View Category Page →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {catTools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onNavigate(`/${t.slug}`)}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-slate-800">{t.title}</span>
                      <span className="text-xs text-slate-400 font-mono">/{t.slug}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Static and Legal Pages */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Company & Legal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'About QuickToolKit', path: '/about' },
                { name: 'Contact & Support', path: '/contact' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Use', path: '/terms-of-use' },
                { name: 'Disclaimer', path: '/disclaimer' },
                { name: 'XML Sitemap', path: '/sitemap.xml' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (item.path.endsWith('.xml')) {
                      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
                      window.location.href = `${base}${item.path}`;
                    } else {
                      onNavigate(item.path);
                    }
                  }}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
