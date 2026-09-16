import React, { useState } from 'react';
import { Copy, Check, RotateCcw, CaseUpper } from 'lucide-react';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const sampleText = 'free online tools for everyday tasks - fast, private and simple.';

  const toUpperCase = () => {
    setText((prev) => prev.toUpperCase());
  };

  const toLowerCase = () => {
    setText((prev) => prev.toLowerCase());
  };

  const toTitleCase = () => {
    const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'v', 'vs', 'via']);
    setText((prev) => {
      return prev
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
          if (word.length === 0) return '';
          if (index === 0 || !minorWords.has(word)) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          return word;
        })
        .join(' ');
    });
  };

  const toSentenceCase = () => {
    setText((prev) => {
      return prev
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    });
  };

  const toCapitalizedCase = () => {
    setText((prev) => {
      return prev
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    });
  };

  const toCamelCase = () => {
    setText((prev) => {
      return prev
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    });
  };

  const toKebabCase = () => {
    setText((prev) => {
      return prev
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    });
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
      {/* Editor Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="case-converter-input" className="text-sm font-bold text-slate-800">
            Enter or Paste Text
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText(sampleText)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Load Sample
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setText('')}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="case-converter-input"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here, then choose a conversion style below..."
          className="w-full rounded-xl border border-slate-300 p-4 text-base text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden font-normal leading-relaxed"
        />

        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>{text.length} characters</span>
          <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
        </div>
      </div>

      {/* Case Options Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Convert Format
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={toTitleCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            Title Case
          </button>
          <button
            type="button"
            onClick={toUpperCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={toLowerCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            lowercase
          </button>
          <button
            type="button"
            onClick={toSentenceCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            Sentence case
          </button>
          <button
            type="button"
            onClick={toCapitalizedCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            Capitalized Case
          </button>
          <button
            type="button"
            onClick={toCamelCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            camelCase
          </button>
          <button
            type="button"
            onClick={toKebabCase}
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs"
          >
            kebab-case
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          Click any format button to transform your text instantly.
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-200" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Converted Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
