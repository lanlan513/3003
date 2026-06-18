export interface HistoryPeriod {
  id: string;
  dynasty: string;
  period: string;
  year: string;
  color: string;
  summary: string;
  description: string;
  achievements: string[];
  representative: { name: string; desc: string }[];
  imagePrompt: string;
}

export interface Region {
  id: string;
  name: string;
  shortName: string;
  location: string;
  era: string;
  specialty: string;
  color: string;
  bgColor: string;
  description: string;
  features: string[];
  masterpieces: { name: string; desc: string }[];
  famousFor: string[];
  imagePrompt: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  alias: string;
  era: string;
  categoryId: string;
  description: string;
  features: string[];
  usage: string;
  variants: string[];
  imagePrompt: string;
}

export interface ShapeCategory {
  id: string;
  category: string;
  description: string;
  icon: string;
}

export interface CraftStep {
  id: string;
  step: number;
  title: string;
  icon: string;
  description: string;
  details: string;
  tips: string;
}

export interface GlazeColor {
  name: string;
  color: string;
  lightColor: string;
  description: string;
  formula: string;
  era: string;
}

export interface CraftProcess {
  id: string;
  name: string;
  description: string;
  steps: CraftStep[];
  glazes: GlazeColor[];
}

export type DetailType = 'history' | 'region' | 'shape' | 'craft';

export interface DetailData {
  type: DetailType;
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  sections: { title: string; content: string[] }[];
  color?: string;
  bgColor?: string;
  imagePrompt: string;
}
