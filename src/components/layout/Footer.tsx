import React from 'react';
import { Sparkles, Shield, Lock, Zap, Heart } from 'lucide-react';
import { TOOLS_DATA, CATEGORIES } from '../../data/toolsData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      {/* Privacy & Trust Banner */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Zero Server Uploads</p>
                <p className="text-xs text-slate-500">Your files remain 100% private in browser</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">No Sign-up or Accounts</p>
                <p className="text-xs text-slate-500">Instant access to all tools without forms</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Zero-Budget Free Forever</p>
                <p className="text-xs text-slate-500">Optimized for high speed and mobile browsers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                QUICK<span className="text-blue-600">TOOLKIT</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              Free Online Tools for Everyday Tasks. Fast, simple, and private browser-based utilities for images, PDFs, text, design, and developers.
            </p>
            <p className="text-xs text-slate-500">
              Files are processed locally in your browser whenever technically possible and are never stored on external servers.
            </p>
          </div>

          {/* Image & PDF Tools */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Image & PDF
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/image-compressor')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/image-resizer')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/image-converter')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Image Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/jpg-to-pdf')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  JPG to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pdf-to-jpg')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  PDF to JPG
                </button>
              </li>
            </ul>
          </div>

          {/* Text, Design, Dev Tools */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Text & Dev
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/word-counter')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Word Counter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/case-converter')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Case Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/remove-duplicate-lines')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Remove Duplicate Lines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/color-palette-generator')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Color Palette Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/json-formatter')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  JSON Formatter
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              About & Legal
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy-policy')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Terms of Use
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/sitemap')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  HTML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} QuickToolKit. Free Online Tools for Everyday Tasks.</p>
          <div className="flex items-center gap-4">
            <a
              href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/sitemap.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              XML Sitemap
            </a>
            <a
              href={`${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/robots.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-800 transition-colors"
            >
              robots.txt
            </a>
            <span className="text-slate-400">•</span>
            <span>Built for Speed & Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
