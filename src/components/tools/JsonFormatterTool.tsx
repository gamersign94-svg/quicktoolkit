import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, AlertCircle, Sparkles, FileCode2, Minimize2 } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const sampleJson = `{
  "name": "QuickToolKit",
  "version": "1.0.0",
  "description": "Free Online Tools for Everyday Tasks",
  "features": [
    "Image Compressor",
    "Image Resizer",
    "JPG to PDF",
    "JSON Formatter"
  ],
  "privacy": {
    "localProcessingOnly": true,
    "serverUploads": false
  },
  "rating": 5.0
}`;

  const formatJson = (indentSpaces = 2) => {
    if (!jsonInput.trim()) {
      setErrorMessage('Please enter some JSON to format.');
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, indentSpaces);
      setJsonInput(formatted);
      setErrorMessage(null);
      setIsValid(true);
    } catch (err: unknown) {
      setIsValid(false);
      const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
      setErrorMessage(`JSON Syntax Error: ${msg}`);
    }
  };

  const minifyJson = () => {
    if (!jsonInput.trim()) {
      setErrorMessage('Please enter some JSON to minify.');
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setErrorMessage(null);
      setIsValid(true);
    } catch (err: unknown) {
      setIsValid(false);
      const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
      setErrorMessage(`JSON Syntax Error: ${msg}`);
    }
  };

  const validateJson = () => {
    if (!jsonInput.trim()) {
      setErrorMessage('Please enter some JSON to validate.');
      setIsValid(false);
      return;
    }

    try {
      JSON.parse(jsonInput);
      setErrorMessage(null);
      setIsValid(true);
    } catch (err: unknown) {
      setIsValid(false);
      const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
      setErrorMessage(`JSON Syntax Error: ${msg}`);
    }
  };

  const handleCopy = () => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonInput) return;
    const blob = new Blob([jsonInput], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quicktoolkit-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setJsonInput('');
    setErrorMessage(null);
    setIsValid(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => formatJson(2)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Beautify (2 Spaces)</span>
          </button>
          <button
            type="button"
            onClick={() => formatJson(4)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Beautify (4 Spaces)</span>
          </button>
          <button
            type="button"
            onClick={minifyJson}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Minify</span>
          </button>
          <button
            type="button"
            onClick={validateJson}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>Validate JSON</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setJsonInput(sampleJson);
              setErrorMessage(null);
              setIsValid(null);
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Load Sample
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-slate-500 hover:text-red-600 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Error or Success Status Banner */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-mono text-red-700 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isValid === true && !errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Valid JSON syntax! Ready to copy or download.</span>
        </div>
      )}

      {/* Editor Box */}
      <div className="space-y-1.5">
        <label htmlFor="json-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          JSON Payload
        </label>
        <textarea
          id="json-input"
          rows={14}
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            setIsValid(null);
            setErrorMessage(null);
          }}
          placeholder="Paste raw JSON here, then click 'Beautify' or 'Validate'..."
          className="w-full rounded-xl border border-slate-300 p-4 text-xs sm:text-sm font-mono text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden leading-relaxed placeholder:font-sans placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
          <span>{jsonInput.length} characters</span>
          <span>{jsonInput ? jsonInput.split('\n').length : 0} lines</span>
        </div>
      </div>

      {/* Footer Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          Parsed 100% locally in browser memory. Sensitive API credentials stay private.
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!jsonInput}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!jsonInput}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download .json</span>
          </button>
        </div>
      </div>
    </div>
  );
};
