import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './components/pages/HomePage';
import { ToolPage } from './components/pages/ToolPage';
import { CategoryPage } from './components/pages/CategoryPage';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  DisclaimerPage,
  SitemapPage,
} from './components/pages/StaticPages';
import { TOOLS_DATA, CATEGORIES } from './data/toolsData';
import { ToolCategory } from './types';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigate handler
  const handleNavigate = useCallback((path: string) => {
    if (path.startsWith('http://') || path.startsWith('https://') || path.endsWith('.xml') || path.endsWith('.txt')) {
      window.location.href = path;
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Popstate listener for back/forward browser buttons
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keyboard shortcut listener for Search (Cmd/Ctrl + K or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resolve current route
  const renderRoute = () => {
    const normalizedPath = currentPath.replace(/\/$/, '') || '/';

    if (normalizedPath === '/') {
      return <HomePage onNavigate={handleNavigate} onOpenSearch={() => setIsSearchOpen(true)} />;
    }

    if (normalizedPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (normalizedPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    if (normalizedPath === '/privacy-policy') {
      return <PrivacyPolicyPage onNavigate={handleNavigate} />;
    }

    if (normalizedPath === '/terms' || normalizedPath === '/terms-of-use') {
      return <TermsPage onNavigate={handleNavigate} />;
    }

    if (normalizedPath === '/disclaimer') {
      return <DisclaimerPage onNavigate={handleNavigate} />;
    }

    if (normalizedPath === '/sitemap') {
      return <SitemapPage onNavigate={handleNavigate} />;
    }

    // Category Routes: /category/:category
    if (normalizedPath.startsWith('/category/')) {
      const categoryParam = normalizedPath.replace('/category/', '') as ToolCategory;
      const validCategory = CATEGORIES.find((c) => c.id === categoryParam);
      if (validCategory) {
        return <CategoryPage category={categoryParam} onNavigate={handleNavigate} />;
      }
    }

    // Tool Routes: /:slug
    const toolSlug = normalizedPath.replace(/^\//, '');
    const matchedTool = TOOLS_DATA.find((t) => t.slug === toolSlug);
    if (matchedTool) {
      return <ToolPage tool={matchedTool} onNavigate={handleNavigate} />;
    }

    // 404 Not Found Page
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-600">
            We couldn't find the page or tool you're looking for. It may have been moved or renamed.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Search Tools</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="grow">
        {renderRoute()}
      </main>

      <Footer onNavigate={handleNavigate} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
