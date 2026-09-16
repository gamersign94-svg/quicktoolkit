import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, Copy, Check, Sparkles, RefreshCw, Code } from 'lucide-react';

interface PaletteColor {
  hex: string;
  rgb: string;
  isLocked: boolean;
  isLight: boolean;
}

export const ColorPaletteGeneratorTool: React.FC = () => {
  const [colors, setColors] = useState<PaletteColor[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [harmonyMode, setHarmonyMode] = useState<string>('random');
  const [showCssExport, setShowCssExport] = useState<boolean>(false);

  // Helper: HSL to HEX and RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h = h % 360;
    s = s / 100;
    l = l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);

    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    const hex = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
    const rgb = `rgb(${red}, ${green}, ${blue})`;
    // Perceived brightness
    const isLight = (red * 299 + green * 587 + blue * 114) / 1000 > 140;

    return { hex, rgb, isLight };
  };

  const generateNewColors = useCallback(() => {
    const baseHue = Math.floor(Math.random() * 360);
    const hues: number[] = [];

    if (harmonyMode === 'saas') {
      // Modern SaaS slate + vibrant primary + accents
      hues.push(220, 215, 210, 160, 25);
    } else if (harmonyMode === 'sunset') {
      hues.push(340, 15, 35, 45, 280);
    } else if (harmonyMode === 'ocean') {
      hues.push(195, 210, 180, 225, 200);
    } else if (harmonyMode === 'forest') {
      hues.push(140, 95, 165, 40, 80);
    } else {
      // Analogous + complementary mix
      hues.push(
        baseHue,
        (baseHue + 30) % 360,
        (baseHue + 60) % 360,
        (baseHue + 180) % 360,
        (baseHue + 210) % 360
      );
    }

    setColors((prev) => {
      const result: PaletteColor[] = [];
      for (let i = 0; i < 5; i++) {
        if (prev[i] && prev[i].isLocked) {
          result.push(prev[i]);
        } else {
          const sat = 65 + Math.floor(Math.random() * 30);
          const light = 30 + Math.floor(Math.random() * 50);
          const { hex, rgb, isLight } = hslToRgb(hues[i] + Math.floor(Math.random() * 20 - 10), sat, light);
          result.push({
            hex,
            rgb,
            isLocked: false,
            isLight,
          });
        }
      }
      return result;
    });
  }, [harmonyMode]);

  // Initial load
  useEffect(() => {
    generateNewColors();
  }, [generateNewColors]);

  // Spacebar hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'BUTTON'
      ) {
        e.preventDefault();
        generateNewColors();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewColors]);

  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const cssExportCode = `:root {
  --color-1: ${colors[0]?.hex || ''};
  --color-2: ${colors[1]?.hex || ''};
  --color-3: ${colors[2]?.hex || ''};
  --color-4: ${colors[3]?.hex || ''};
  --color-5: ${colors[4]?.hex || ''};
}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xs space-y-6">
      {/* Harmony controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Harmony Theme:</span>
          <select
            value={harmonyMode}
            onChange={(e) => setHarmonyMode(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="random">Dynamic Harmony</option>
            <option value="saas">Modern SaaS</option>
            <option value="sunset">Warm Sunset</option>
            <option value="ocean">Cool Ocean</option>
            <option value="forest">Natural Forest</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCssExport(!showCssExport)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Code className="h-3.5 w-3.5" />
            <span>{showCssExport ? 'Hide CSS' : 'Export CSS'}</span>
          </button>
          <button
            type="button"
            onClick={generateNewColors}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Generate New Palette</span>
          </button>
        </div>
      </div>

      {/* Palette Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-2xl overflow-hidden min-h-[360px] sm:min-h-[400px]">
        {colors.map((c, index) => {
          const textColor = c.isLight ? 'text-slate-900' : 'text-white';
          const iconBg = c.isLight ? 'bg-black/10 hover:bg-black/20' : 'bg-white/20 hover:bg-white/30';

          return (
            <div
              key={index}
              style={{ backgroundColor: c.hex }}
              className={`relative flex flex-col justify-between p-5 rounded-xl transition-all duration-300 shadow-2xs ${textColor}`}
            >
              {/* Top Lock Action */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold opacity-75">#{index + 1}</span>
                <button
                  type="button"
                  onClick={() => toggleLock(index)}
                  className={`p-2 rounded-xl backdrop-blur-xs transition-all cursor-pointer ${iconBg}`}
                  title={c.isLocked ? 'Unlock color' : 'Lock color'}
                >
                  {c.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4 opacity-75" />}
                </button>
              </div>

              {/* Bottom Codes & Copy */}
              <div className="space-y-2">
                <div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(c.hex)}
                    className="group flex items-center justify-between w-full text-left font-mono font-bold text-lg sm:text-xl tracking-wider cursor-pointer"
                    title="Click to copy HEX"
                  >
                    <span>{c.hex}</span>
                    <span className={`p-1 rounded-md transition-opacity ${copiedHex === c.hex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {copiedHex === c.hex ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </span>
                  </button>
                  <p className="text-[11px] font-mono opacity-80 mt-0.5">{c.rgb}</p>
                </div>

                <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[10px] font-medium opacity-75">
                  <span>{c.isLocked ? 'Locked' : 'Press Space to Roll'}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(c.rgb)}
                    className="hover:underline cursor-pointer"
                  >
                    Copy RGB
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
        <span>Tip: Press the <kbd className="font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">Spacebar</kbd> on your keyboard to instantly generate a new palette.</span>
        <span>Lock your favorites with the padlock icon.</span>
      </div>

      {/* CSS Export Accordion */}
      {showCssExport && (
        <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white animate-in fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CSS Custom Properties</span>
            <button
              type="button"
              onClick={() => copyToClipboard(cssExportCode)}
              className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy CSS</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 bg-slate-950 rounded-lg">
            {cssExportCode}
          </pre>
        </div>
      )}
    </div>
  );
};
