import React, { useState, useRef } from 'react';
import { UploadCloud, Download, RotateCcw, AlertCircle, Check, ArrowRight, RefreshCw } from 'lucide-react';

export const ImageConverterTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sourceFormat, setSourceFormat] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [quality, setQuality] = useState<number>(90);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
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

  const getFormatLabel = (mime: string): string => {
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'JPG';
    if (mime.includes('png')) return 'PNG';
    if (mime.includes('webp')) return 'WebP';
    return mime;
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit.');
      return;
    }

    setSelectedFile(file);
    setSourceFormat(file.type);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedBlob(null);
    setConvertedUrl(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Pick a sensible default target different from source
    if (file.type.includes('png')) setTargetFormat('image/webp');
    else if (file.type.includes('webp')) setTargetFormat('image/png');
    else setTargetFormat('image/webp');
  };

  const handleConvert = async () => {
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
        img.onerror = () => reject(new Error('Failed to load image for conversion.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context.');

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMessage('Conversion failed. Please try another format.');
            return;
          }
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          const newUrl = URL.createObjectURL(blob);
          setConvertedBlob(blob);
          setConvertedUrl(newUrl);
        },
        targetFormat,
        quality / 100
      );
    } catch (err: unknown) {
      setIsProcessing(false);
      const message = err instanceof Error ? err.message : 'Error during conversion.';
      setErrorMessage(message);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob) return;
    const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/png' ? 'png' : 'jpg';
    const originalName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'converted-image';
    const link = document.createElement('a');
    link.href = convertedUrl || '';
    link.download = `${originalName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedBlob(null);
    setConvertedUrl(null);
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
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-2xs">
            <RefreshCw className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Select an image to convert, or <span className="text-blue-600">Browse</span>
          </h3>
          <p className="mt-1.5 text-xs text-slate-500">
            Supports two-way conversion among JPG, PNG, and WebP. 100% private in-browser.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Browse Image
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Preview Box */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative flex aspect-video max-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2">
                {previewUrl && (
                  <img
                    src={convertedUrl || previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                  />
                )}
                <div className="absolute top-2 left-2 rounded-md bg-slate-900/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                  {convertedUrl ? `Converted (${getFormatLabel(targetFormat)})` : `Original (${getFormatLabel(sourceFormat)})`}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="font-semibold text-slate-900">
                  {getFormatLabel(sourceFormat)} • {formatBytes(selectedFile.size)}
                </span>
              </div>
            </div>

            {/* Conversion Settings */}
            <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Convert To Format:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'JPG (Photos)', val: 'image/jpeg' },
                      { label: 'PNG (Lossless)', val: 'image/png' },
                      { label: 'WebP (Modern)', val: 'image/webp' },
                    ].map((fmt) => (
                      <button
                        key={fmt.val}
                        type="button"
                        onClick={() => setTargetFormat(fmt.val as any)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          targetFormat === fmt.val
                            ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{fmt.label.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{fmt.label.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {targetFormat !== 'image/png' && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Export Quality</span>
                      <span className="text-blue-600 font-bold">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="mt-2 w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                  </div>
                )}

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
                  <span>Target Format:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {getFormatLabel(targetFormat)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Converting...' : `Convert to ${getFormatLabel(targetFormat)}`}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Converted result */}
          {convertedBlob && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-emerald-900">Conversion Successful!</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800">
                    <span>
                      Converted to <strong>{getFormatLabel(targetFormat)}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      File Size: <strong>{formatBytes(convertedBlob.size)}</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {getFormatLabel(targetFormat)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
