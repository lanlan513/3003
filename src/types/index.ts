export interface TypicalArtifact {
  name: string;
  desc: string;
  imagePrompt: string;
}

export interface GlazeFeature {
  name: string;
  color: string;
  description: string;
  formula?: string;
}

export interface CraftEvolution {
  title: string;
  description: string;
  impact: string;
}

export interface TimelineDynasty {
  id: string;
  dynasty: string;
  period: string;
  year: string;
  startYear: number;
  endYear: number;
  color: string;
  summary: string;
  description: string;
  achievements: string[];
  representative: { name: string; desc: string }[];
  typicalArtifacts: TypicalArtifact[];
  glazeFeatures: GlazeFeature[];
  craftEvolutions: CraftEvolution[];
  imagePrompt: string;
}

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

export type DetailType = 'history' | 'region' | 'shape' | 'craft' | 'timeline' | 'artifact' | 'glaze' | 'craft-evolution' | 'pottery-result';

export interface ClayType {
  id: string;
  name: string;
  description: string;
  color: string;
  properties: {
    whiteness: number;
    plasticity: number;
    firingRange: [number, number];
    texture: string;
  };
  impact: {
    baseColor: string;
    translucency: number;
    texture: string;
  };
}

export interface FormingMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  properties: {
    regularity: number;
    artistry: number;
    uniqueness: number;
    difficulty: number;
  };
  typicalShapes: string[];
}

export interface FiringTemperature {
  id: string;
  name: string;
  range: [number, number];
  description: string;
  color: string;
  properties: {
    porcelainization: number;
    hardness: number;
    glazeVibrancy: number;
    riskFactor: number;
  };
}

export interface PotterySelection {
  clay: ClayType | null;
  formingMethod: FormingMethod | null;
  glaze: GlazeColor | null;
  temperature: FiringTemperature | null;
}

export interface PotteryFlaw {
  name: string;
  description: string;
  severity: 'minor' | 'major' | 'fatal';
}

export interface PotteryResult {
  id: string;
  overallScore: number;
  qualityGrade: '精品' | '佳品' | '合格品' | '次品' | '废品';
  glazeEffect: string;
  colorDescription: string;
  shapeQuality: string;
  uniqueness: string;
  flaws: PotteryFlaw[];
  features: string[];
  finalAppearance: {
    primaryColor: string;
    secondaryColor: string;
    pattern: string;
    texture: string;
  };
  story: string;
  historicalReference: string;
  imagePrompt: string;
}

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
