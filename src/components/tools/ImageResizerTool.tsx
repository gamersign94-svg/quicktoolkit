import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Download, RotateCcw, Lock, Unlock, AlertCircle, Check, Sparkles } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/jpeg');
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
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
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setResizedBlob(null);
    setResizedUrl(null);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
    };

    if (file.type === 'image/png') setOutputFormat('image/png');
    else if (file.type === 'image/webp') setOutputFormat('image/webp');
    else setOutputFormat('image/jpeg');
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (maintainAspectRatio && originalDims.width > 0) {
      const ratio = originalDims.height / originalDims.width;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (maintainAspectRatio && originalDims.height > 0) {
      const ratio = originalDims.width / originalDims.height;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const applyPreset = (percentage: number) => {
    if (originalDims.width <= 0) return;
    const factor = percentage / 100;
    setTargetWidth(Math.round(originalDims.width * factor));
    setTargetHeight(Math.round(originalDims.height * factor));
  };

  const handleResize = async () => {
    if (!selectedFile || !previewUrl) {
      setErrorMessage('Please select an image first.');
      return;
    }

    if (targetWidth <= 0 || targetHeight <= 0) {
      setErrorMessage('Width and Height must be positive numbers.');
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
        img.onerror = () => reject(new Error('Failed to load image for resizing.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context.');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMessage('Resizing failed. Please try again.');
            return;
          }
          if (resizedUrl) URL.revokeObjectURL(resizedUrl);
          const newUrl = URL.createObjectURL(blob);
          setResizedBlob(blob);
          setResizedUrl(newUrl);
        },
        outputFormat,
        0.92
      );
    } catch (err: unknown) {
      setIsProcessing(false);
      const message = err instanceof Error ? err.message : 'Error resizing image.';
      setErrorMessage(message);
    }
  };

  const handleDownload = () => {
    if (!resizedBlob) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    const originalName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') : 'resized-image';
    const link = document.createElement('a');
    link.href = resizedUrl || '';
    link.download = `${originalName}-${targetWidth}x${targetHeight}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResizedBlob(null);
    setResizedUrl(null);
    setOriginalDims({ width: 0, height: 0 });
    setTargetWidth(0);
    setTargetHeight(0);
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
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Drag & drop your image to resize, or <span className="text-blue-600">Browse</span>
          </h3>
          <p className="mt-1.5 text-xs text-slate-500">
            Supports JPG, PNG, and WebP formats. Processed locally in memory.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Select Image
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
                    src={resizedUrl || previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                  />
                )}
                <div className="absolute top-2 left-2 rounded-md bg-slate-900/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                  {resizedUrl ? `${targetWidth} × ${targetHeight} px` : `${originalDims.width} × ${originalDims.height} px`}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="font-semibold text-slate-900">
                  Original: {originalDims.width} × {originalDims.height} px ({formatBytes(selectedFile.size)})
                </span>
              </div>
            </div>

            {/* Resize Controls */}
            <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Dimensions inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={targetWidth || ''}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={targetHeight || ''}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Lock Toggle */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
                  <div className="flex items-center gap-2">
                    {maintainAspectRatio ? (
                      <Lock className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Unlock className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-xs font-semibold text-slate-800">
                      Maintain Aspect Ratio
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      maintainAspectRatio ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        maintainAspectRatio ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Percentage Presets */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quick Scale Presets
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => applyPreset(pct)}
                        className="py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'JPG', val: 'image/jpeg' },
                      { label: 'PNG', val: 'image/png' },
                      { label: 'WebP', val: 'image/webp' },
                    ].map((fmt) => (
                      <button
                        key={fmt.val}
                        type="button"
                        onClick={() => setOutputFormat(fmt.val as any)}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          outputFormat === fmt.val
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

              {/* Actions */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleResize}
                  disabled={isProcessing}
                  className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  {isProcessing ? 'Resizing...' : 'Resize Image'}
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

          {/* Resized Result */}
          {resizedBlob && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-emerald-900">Image Resized Successfully!</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800">
                    <span>
                      Dimensions: <strong>{targetWidth} × {targetHeight} px</strong>
                    </span>
                    <span>•</span>
                    <span>
                      File Size: <strong>{formatBytes(resizedBlob.size)}</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resized Image</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
