import React, { useState, useRef } from 'react';
import { UploadCloud, Download, RotateCcw, AlertCircle, Check, FileImage, Sparkles, Eye } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export const PdfToJpgTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('PDF file is larger than the 50MB limit.');
      return;
    }

    setSelectedFile(file);
    setPages([]);
    setIsProcessing(true);
    setProgressText('Loading PDF document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        setProgressText(`Rendering page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.75 }); // Crisp 1.75x density for high clarity

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Fill white background for JPEG rendering
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        } as any).promise;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.92);
        });

        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          rendered.push({
            pageNumber: i,
            dataUrl,
            blob,
            width: viewport.width,
            height: viewport.height,
          });
        }
      }

      setPages(rendered);
      setIsProcessing(false);
      setProgressText('');
    } catch (err: unknown) {
      setIsProcessing(false);
      setProgressText('');
      const msg = err instanceof Error ? err.message : 'Error rendering PDF pages. Please check that the PDF is valid.';
      setErrorMessage(msg);
    }
  };

  const downloadSinglePage = (page: RenderedPage) => {
    const baseName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'document';
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `${baseName}-page-${page.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllPages = () => {
    pages.forEach((p, idx) => {
      setTimeout(() => {
        downloadSinglePage(p);
      }, idx * 250);
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPages([]);
    setIsProcessing(false);
    setProgressText('');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-2xs">
            <FileImage className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Drag & drop your PDF file here, or <span className="text-blue-600">Browse</span>
          </h3>
          <p className="mt-1.5 text-xs text-slate-500">
            Extracts every page as a high-resolution JPG. 100% private client-side processing.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Select PDF File
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary & actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-bold text-slate-900 truncate max-w-sm">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {formatBytes(selectedFile.size)} • {pages.length > 0 ? `${pages.length} pages extracted` : 'Extracting...'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {pages.length > 1 && (
                <button
                  type="button"
                  onClick={downloadAllPages}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download All JPGs</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Upload Another</span>
              </button>
            </div>
          </div>

          {/* Processing state indicator */}
          {isProcessing && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-r-transparent" />
              <p className="text-sm font-semibold text-slate-700">{progressText}</p>
              <p className="text-xs text-slate-400">Rendering directly in your browser memory...</p>
            </div>
          )}

          {/* Rendered pages gallery */}
          {!isProcessing && pages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs flex flex-col justify-between space-y-3 hover:border-blue-200 transition-colors"
                >
                  <div className="aspect-3/4 w-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-100">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="max-h-full max-w-full object-contain rounded shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Page {p.pageNumber}</span>
                      <span className="text-[11px] text-slate-400 block">{formatBytes(p.blob.size)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadSinglePage(p)}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download JPG</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
