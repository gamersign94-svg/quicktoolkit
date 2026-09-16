export type ToolCategory = 'image' | 'pdf' | 'text' | 'design' | 'developer';

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolHowToStep {
  step: number;
  title: string;
  description: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  category: ToolCategory;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  features: string[];
  howToSteps: ToolHowToStep[];
  faqs: ToolFAQ[];
  supportedFormats: string[];
  useCases: string[];
  relatedToolSlugs: string[];
  privacyNote: string;
}

export interface NavigationLink {
  label: string;
  path: string;
  category?: ToolCategory;
}
