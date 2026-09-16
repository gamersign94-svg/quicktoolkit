import React, { useState } from 'react';
import { Search, Menu, X, Shield, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/toolsData';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 text-left transition-transform hover:scale-[1.01] cursor-pointer"
            aria-label="QuickToolKit Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                QUICK<span className="text-blue-600">TOOLKIT</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase block mt-0.5">
                Free Online Tools
              </span>
            </div>
          </button>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentPath === '/'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            {CATEGORIES.map((cat) => {
              const catPath = `/category/${cat.id}`;
              const isActive = currentPath === catPath;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleNav(catPath)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Search + Privacy Badge + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-800 transition-all cursor-pointer shadow-2xs"
            aria-label="Search tools"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Search a tool...</span>
            <kbd className="hidden sm:inline-block rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
              /
            </kbd>
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Client-Side Private</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPath === '/' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            {CATEGORIES.map((cat) => {
              const catPath = `/category/${cat.id}`;
              const isActive = currentPath === catPath;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleNav(catPath)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Fast, Free, Local Processing</span>
            <span className="font-semibold text-emerald-600">No Sign-up Needed</span>
          </div>
        </div>
      )}
    </header>
  );
};
