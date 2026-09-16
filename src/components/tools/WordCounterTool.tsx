import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, FileText, Clock, Volume2, Sparkles, BookOpen } from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const sampleText = `QuickToolKit provides fast, free, and private browser-based utilities for daily workflow. Every image, document, and text string is processed directly in your device's memory using modern HTML5 Canvas, Blob APIs, and Web Workers.

By eliminating server-side uploads, users enjoy instant processing speeds and complete data privacy. Whether you need to compress high-resolution photos, convert JPG files to PDF, format complex JSON code, or inspect writing metrics, QuickToolKit offers professional-grade tools with zero paywalls.`;

  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();

    // Characters
    const charCount = raw.length;
    const charNoSpacesCount = raw.replace(/\s/g, '').length;

    // Words
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    // Sentences
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      : [];
    const sentenceCount = sentences.length;

    // Paragraphs
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0)
      : [];
    const paragraphCount = paragraphs.length;

    // Reading & Speaking time
    const readingTimeMinutes = (wordCount / 200).toFixed(1);
    const speakingTimeMinutes = (wordCount / 130).toFixed(1);

    // Keyword density
    const frequencyMap: Record<string, number> = {};
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'is', 'are', 'was', 'were', 'your'
    ]);

    words.forEach((w) => {
      const cleaned = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleaned.length > 2 && !stopWords.has(cleaned)) {
        frequencyMap[cleaned] = (frequencyMap[cleaned] || 0) + 1;
      }
    });

    const sortedKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / (wordCount || 1)) * 100).toFixed(1),
      }));

    return {
      charCount,
      charNoSpacesCount,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTimeMinutes,
      speakingTimeMinutes,
      sortedKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Words</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.wordCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Total words</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Characters</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.charCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">With spaces</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No Spaces</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.charNoSpacesCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Chars without spaces</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sentences</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.sentenceCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Sentence units</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paragraphs</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.paragraphCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Paragraph breaks</p>
        </div>
      </div>

      {/* Editor Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="word-counter-input" className="text-sm font-bold text-slate-800">
            Enter or Paste Text
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText(sampleText)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Load Sample Text
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
          id="word-counter-input"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your article, essay, notes, or tweet here to inspect live metrics..."
          className="w-full rounded-xl border border-slate-300 p-4 text-base text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden font-normal leading-relaxed placeholder:text-slate-400"
        />
      </div>

      {/* Action Row & Time projections */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Reading: <strong>~{stats.readingTimeMinutes} min</strong> (200 wpm)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Volume2 className="h-4 w-4 text-emerald-600" />
            <span>Speaking: <strong>~{stats.speakingTimeMinutes} min</strong> (130 wpm)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Top Keywords Density */}
      {stats.sortedKeywords.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-2.5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Top Keyword Density
          </p>
          <div className="flex flex-wrap gap-2">
            {stats.sortedKeywords.map((item) => (
              <span
                key={item.word}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-2xs"
              >
                <span className="font-semibold text-slate-900">{item.word}</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                  {item.count}× ({item.percent}%)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
