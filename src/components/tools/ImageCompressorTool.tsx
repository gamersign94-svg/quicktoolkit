import React, { useState, useRef } from 'react';
import { UploadCloud, Download, RotateCcw, Image, Check, AlertCircle, Sparkles } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
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

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File exceeds the 25MB limit. Please select a smaller image.');
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setCompressedBlob(null);
    setCompressedUrl(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Set default output format matching image type if supported
    if (file.type === 'image/webp') setOutputFormat('image/webp');
    else if (file.type === 'image/png') setOutputFormat('image/png');
    else setOutputFormat('image/jpeg');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const compressImage = async () => {
    if (!selectedFile || !previewUrl) {
      setErrorMessage('Please select an image first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = previewUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image for processing.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D rendering context.');

      // If output is JPEG, draw a white background to avoid black transparency
      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // PNG does not use lossy quality factor in canvas.toBlob, so for PNG we can export or encourage WebP/JPEG
      const qFactor = quality / 100;
      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMessage('Compression failed. Please try a different quality or format.');
            return;
          }

          if (compressedUrl) URL.revokeObjectURL(compressedUrl);
          const newUrl = URL.createObjectURL(blob);
          setCompressedBlob(blob);
          setCompressedUrl(newUrl);
        },
        outputFormat,
        qFactor
      );
    } catch (err: unknown) {
      setIsProcessing(false);
      const message = err instanceof Error ? err.message : 'Something went wrong while compressing the image. Please try again.';
      setErrorMessage(message);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const originalName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'compressed-image';
    const link = document.createElement('a');
    link.href = compressedUrl || '';
    link.download = `${originalName}-compressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const percentSaved =
    selectedFile && compressedBlob && selectedFile.size > 0
      ? Math.max(0, Math.round(((selectedFile.size - compressedBlob.size) / selectedFile.size) * 100))
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs">
      {errorMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
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
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-2xs">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Drag & drop your image here, or <span className="text-blue-600">Browse</span>
          </h3>
          <p className="mt-1.5 text-xs text-slate-500">
            Supports JPG, JPEG, PNG, and WebP (Up to 25MB). 100% processed locally in your browser.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Browse Files
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File summary & Controls Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Image Preview & Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative flex aspect-video max-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2">
                {previewUrl && (
                  <img
                    src={compressedUrl || previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                  />
                )}
                <div className="absolute top-2 left-2 rounded-md bg-slate-900/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                  {compressedUrl ? 'Compressed Preview' : 'Original Preview'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="font-medium truncate max-w-[200px]" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="font-semibold text-slate-900">
                  Original: {formatBytes(selectedFile.size)}
                </span>
              </div>
            </div>

            {/* Settings & Quality Slider */}
            <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
                    <label htmlFor="quality-slider">Compression Quality</label>
                    <span className="text-blue-600 font-bold">{quality}%</span>
                  </div>
                  <input
                    id="quality-slider"
                    type="range"
                    min="5"
                    max="95"
                    step="1"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="mt-2 w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                    <span>Smaller Size (Lower quality)</span>
                    <span>Higher Quality</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Target Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'JPG', value: 'image/jpeg' },
                      { label: 'WebP (Best)', value: 'image/webp' },
                      { label: 'PNG', value: 'image/png' },
                    ].map((fmt) => (
                      <button
                        key={fmt.value}
                        type="button"
                        onClick={() => setOutputFormat(fmt.value as any)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          outputFormat === fmt.value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={compressImage}
                  disabled={isProcessing}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  {isProcessing ? 'Compressing...' : 'Compress Image'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Reset and pick another image"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Compressed Results Box */}
          {compressedBlob && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-emerald-900">Compression Complete!</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800">
                    <span>
                      New Size: <strong>{formatBytes(compressedBlob.size)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Saved:{' '}
                      <strong className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                        {percentSaved}% ({formatBytes(selectedFile.size - compressedBlob.size)})
                      </strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Compressed Image</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
