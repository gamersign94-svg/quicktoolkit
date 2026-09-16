import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, ListFilter, Sparkles } from 'lucide-react';

export const RemoveDuplicateLinesTool: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [ignoreEmpty, setIgnoreEmpty] = useState<boolean>(true);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    originalCount: number;
    uniqueCount: number;
    removedCount: number;
    reductionRate: number;
  } | null>(null);

  const sampleList = `apple
banana
orange
Apple
banana
grape
apple
mango
pineapple
Orange
banana
grape
`;

  const processDeduplication = () => {
    if (!inputText) {
      setOutputText('');
      setStats(null);
      return;
    }

    const rawLines = inputText.split(/\r?\n/);
    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    rawLines.forEach((line) => {
      let processed = trimWhitespace ? line.trim() : line;

      if (ignoreEmpty && processed.length === 0) {
        return;
      }

      const key = caseSensitive ? processed : processed.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(processed);
      }
    });

    const result = uniqueLines.join('\n');
    setOutputText(result);

    const originalCount = rawLines.length;
    const uniqueCount = uniqueLines.length;
    const removedCount = Math.max(0, originalCount - uniqueCount);
    const reductionRate = originalCount > 0 ? Math.round((removedCount / originalCount) * 100) : 0;

    setStats({
      originalCount,
      uniqueCount,
      removedCount,
      reductionRate,
    });
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deduplicated-lines.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setStats(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
      {/* Options Panel */}
      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Cleaning Options
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreEmpty}
              onChange={(e) => setIgnoreEmpty(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span>Ignore Blank/Empty Lines</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span>Case Sensitive Comparison</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            <span>Trim Leading/Trailing Spaces</span>
          </label>
        </div>
      </div>

      {/* Editor Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="dup-input" className="text-xs font-bold text-slate-800">
              Input List
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputText(sampleList)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Load Sample
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            id="dup-input"
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your lines here (one item per row)..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm font-mono text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* Output Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="dup-output" className="text-xs font-bold text-slate-800">
              Deduplicated Unique List
            </label>
            {outputText && (
              <span className="text-xs font-semibold text-emerald-600">
                Order Preserved
              </span>
            )}
          </div>
          <textarea
            id="dup-output"
            rows={10}
            readOnly
            value={outputText}
            placeholder="Click 'Remove Duplicate Lines' to view clean list..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-mono text-slate-800 focus:outline-hidden leading-relaxed"
          />
        </div>
      </div>

      {/* Action Buttons & Statistics */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={processDeduplication}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
        >
          <ListFilter className="h-4 w-4" />
          <span>Remove Duplicate Lines</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!outputText}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!outputText}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Stats Readout Card */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-center animate-in fade-in">
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 uppercase">Original Lines</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.originalCount}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 uppercase">Unique Lines</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{stats.uniqueCount}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 uppercase">Duplicates Removed</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">{stats.removedCount}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-emerald-800 uppercase">Reduction Rate</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5">{stats.reductionRate}%</p>
          </div>
        </div>
      )}
    </div>
  );
};
