import React, { useState, useRef } from 'react';
import { UploadCloud, Download, RotateCcw, AlertCircle, Check, Trash2, FileText, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface UploadedImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export const JpgToPdfTool: React.FC = () => {
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [marginSize, setMarginSize] = useState<'none' | 'small' | 'normal'>('small');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState<number>(0);
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

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const newItems: UploadedImageItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Only image files (JPG, PNG) are supported.');
        continue;
      }
      if (file.size > 20 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} is larger than the 20MB limit.`);
        continue;
      }

      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          newItems.push({
            id: Math.random().toString(36).substring(2, 9),
            file,
            previewUrl: url,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
      });
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const generatePdf = async () => {
    if (images.length === 0) {
      setErrorMessage('Please add at least one image.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Standard A4 dimensions in mm: 210 x 297
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const margin = marginSize === 'none' ? 0 : marginSize === 'small' ? 8 : 15;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          doc.addPage('a4', orientation);
        }

        const item = images[i];
        const imgAspect = item.width / item.height;
        const pageAspect = usableWidth / usableHeight;

        let renderWidth = usableWidth;
        let renderHeight = usableHeight;

        if (imgAspect > pageAspect) {
          renderHeight = usableWidth / imgAspect;
        } else {
          renderWidth = usableHeight * imgAspect;
        }

        const xPos = margin + (usableWidth - renderWidth) / 2;
        const yPos = margin + (usableHeight - renderHeight) / 2;

        // Convert image file to data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(item.file);
        });

        const format = item.file.type.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(dataUrl, format, xPos, yPos, renderWidth, renderHeight);
      }

      const pdfOutputBlob = doc.output('blob');
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const newBlobUrl = URL.createObjectURL(pdfOutputBlob);
      setPdfBlobUrl(newBlobUrl);
      setPdfSize(pdfOutputBlob.size);
      setIsProcessing(false);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Error generating PDF document.';
      setErrorMessage(msg);
    }
  };

  const downloadPdf = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = 'quicktoolkit-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setImages([]);
    setPdfBlobUrl(null);
    setPdfSize(0);
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

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-3 shadow-2xs">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800">
          Drag & drop images here, or <span className="text-blue-600">Browse Files</span>
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Select one or multiple JPG, JPEG, or PNG images. Converted locally into a clean PDF.
        </p>
      </div>

      {/* Selected Images List */}
      {images.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              Selected Images ({images.length} {images.length === 1 ? 'page' : 'pages'})
            </h4>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative group rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden shadow-2xs"
              >
                <div className="aspect-3/4 w-full rounded-lg overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-900">Page {index + 1}</span>
                  <span className="truncate max-w-[70px]">{formatBytes(item.file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(item.id);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-md bg-white/90 text-red-600 shadow-xs opacity-80 hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Options & Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Page Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('p')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    orientation === 'p'
                      ? 'border-blue-600 bg-white text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-white'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('l')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    orientation === 'l'
                      ? 'border-blue-600 bg-white text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-white'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Page Margins</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'None', val: 'none' },
                  { label: 'Small', val: 'small' },
                  { label: 'Normal', val: 'normal' },
                ].map((m) => (
                  <button
                    key={m.val}
                    type="button"
                    onClick={() => setMarginSize(m.val as any)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      marginSize === m.val
                        ? 'border-blue-600 bg-white text-blue-700 shadow-2xs'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={generatePdf}
              disabled={isProcessing}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {isProcessing ? 'Generating PDF...' : 'Create PDF Document'}
            </button>
          </div>

          {/* PDF Ready Result */}
          {pdfBlobUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-emerald-900">PDF Document Ready!</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-emerald-800">
                    <span>
                      {images.length} {images.length === 1 ? 'page' : 'pages'} included
                    </span>
                    <span>•</span>
                    <span>Size: {formatBytes(pdfSize)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={downloadPdf}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
