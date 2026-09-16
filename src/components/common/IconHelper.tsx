import React from 'react';
import {
  Minimize2,
  Maximize2,
  RefreshCw,
  FileSpreadsheet,
  FileImage,
  Hash,
  CaseUpper,
  ListFilter,
  Palette,
  FileCode2,
  Image,
  FileText,
  Type,
  Code2,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  Check,
  Copy,
  Download,
  UploadCloud,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface IconHelperProps {
  name: string;
  className?: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'h-5 w-5' }) => {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'RefreshCw':
      return <RefreshCw className={className} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet className={className} />;
    case 'FileImage':
      return <FileImage className={className} />;
    case 'Hash':
      return <Hash className={className} />;
    case 'CaseUpper':
      return <CaseUpper className={className} />;
    case 'ListFilter':
      return <ListFilter className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'FileCode2':
      return <FileCode2 className={className} />;
    case 'Image':
      return <Image className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Type':
      return <Type className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Lock':
      return <Lock className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'Check':
      return <Check className={className} />;
    case 'Copy':
      return <Copy className={className} />;
    case 'Download':
      return <Download className={className} />;
    case 'UploadCloud':
      return <UploadCloud className={className} />;
    case 'RotateCcw':
      return <RotateCcw className={className} />;
    case 'Sliders':
      return <Sliders className={className} />;
    case 'ExternalLink':
      return <ExternalLink className={className} />;
    case 'ChevronDown':
      return <ChevronDown className={className} />;
    case 'Info':
      return <Info className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'ArrowRight':
      return <ArrowRight className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
