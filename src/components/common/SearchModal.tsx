import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { TOOLS_DATA } from '../../data/toolsData';
import { IconHelper } from './IconHelper';
import { ToolDefinition } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // opened by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const filteredTools: ToolDefinition[] = TOOLS_DATA.filter((tool) => {
    if (!normalizedQuery) return true;
    return (
      tool.title.toLowerCase().includes(normalizedQuery) ||
      tool.shortDesc.toLowerCase().includes(normalizedQuery) ||
      tool.category.toLowerCase().includes(normalizedQuery) ||
      tool.supportedFormats.some((fmt) => fmt.toLowerCase().includes(normalizedQuery)) ||
      tool.features.some((f) => f.toLowerCase().includes(normalizedQuery)) ||
      (normalizedQuery === 'pdf' && (tool.slug.includes('pdf') || tool.title.toLowerCase().includes('pdf'))) ||
      (normalizedQuery === 'image' && tool.category === 'image') ||
      (normalizedQuery === 'compress' && tool.slug === 'image-compressor')
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a tool (e.g. compress, pdf, counter, json)..."
            className="w-full bg-transparent text-base text-slate-800 placeholder-slate-400 focus:outline-hidden"
            aria-label="Search tools"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded cursor-pointer mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No matching tools found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for "image", "compress", "pdf", "word", or "json".
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Available Tools ({filteredTools.length})
              </p>
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.slug);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 group text-left transition-colors border border-transparent hover:border-blue-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconHelper name={tool.iconName} className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{tool.shortDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-2">
                    <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {tool.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Client-side instant search</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
