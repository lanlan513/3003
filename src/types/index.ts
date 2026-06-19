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

export type ArtifactRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ArtifactType = 'shard' | 'complete';
export type ArtifactCategory = 'vase' | 'bowl' | 'jar' | 'plate' | 'teapot' | 'cup' | 'other';
export type ArtifactCondition = 'poor' | 'fair' | 'good' | 'excellent' | 'pristine';
export type ProcessingStage = 'raw' | 'cleaned' | 'classified' | 'identified' | 'collected';

export interface ExcavationSite {
  id: string;
  name: string;
  shortName: string;
  location: string;
  era: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  color: string;
  bgColor: string;
  features: string[];
  famousFinds: string[];
  artifactPoolIds: string[];
  shardWeight: number;
  imagePrompt: string;
}

export interface ExcavationArtifact {
  id: string;
  name: string;
  type: ArtifactType;
  category: ArtifactCategory;
  era: string;
  originKiln: string;
  originSite: string;
  rarity: ArtifactRarity;
  color: string;
  description: string;
  historicalContext: string;
  identificationPoints: string[];
  material: string;
  glazeColor?: string;
  decoration?: string;
  shapeFeatures?: string;
  baseMark?: string;
  referenceValue: string;
  imagePrompt: string;
  completeArtifactId?: string;
}

export interface FoundArtifact {
  id: string;
  artifactId: string;
  foundAt: number;
  siteId: string;
  stage: ProcessingStage;
  condition: ArtifactCondition;
  cleanProgress: number;
  categoryGuess?: ArtifactCategory;
  identificationResult?: ExcavationArtifact;
  museumNote?: string;
  collectedAt?: number;
}

export interface MuseumCollection {
  totalCollected: number;
  byRarity: Record<ArtifactRarity, number>;
  byEra: Record<string, number>;
  byKiln: Record<string, number>;
}

export interface ExcavationState {
  energy: number;
  maxEnergy: number;
  currentSiteId: string | null;
  foundArtifacts: FoundArtifact[];
  collection: MuseumCollection;
  totalDigs: number;
  lastDigTime: number;
}

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

export interface LinkedArtifact {
  id: string;
  name: string;
  originDynasty: string;
  originKiln: string;
  color: string;
  description: string;
}

export interface DetailData {
  type: DetailType;
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  sections: { title: string; content: string[] }[];
  linkedArtifacts?: LinkedArtifact[];
  color?: string;
  bgColor?: string;
  imagePrompt: string;
}

export interface RestorationFragment {
  id: string;
  targetX: number;
  targetY: number;
  targetRotation: number;
  pathData: string;
  width: number;
  height: number;
  color: string;
}

export interface RestorationArtifact {
  id: string;
  name: string;
  era: string;
  origin: string;
  description: string;
  shape: 'vase' | 'bowl' | 'jar' | 'plate' | 'teapot';
  baseColor: string;
  accentColor: string;
  difficulty: 1 | 2 | 3;
  fragments: RestorationFragment[];
  outlinePath: string;
  displayTransform: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
  knowledge: {
    title: string;
    content: string[];
  }[];
  repairMethods: string[];
  historicalValue: string;
  imagePrompt: string;
}

export interface PlacedFragment {
  id: string;
  x: number;
  y: number;
  rotation: number;
  isCorrect: boolean;
  placementAccuracy: number;
}

export interface RestorationScore {
  totalScore: number;
  accuracyScore: number;
  speedScore: number;
  completenessScore: number;
  grade: '修复大师' | '巧夺天工' | '匠心独运' | '初窥门径' | '尚需努力';
  feedback: string;
}

export interface TradeLocation {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  lat: number;
  lng: number;
  description: string;
  importance: 'primary' | 'secondary' | 'minor';
  color: string;
}

export interface TradeRouteSegment {
  from: string;
  to: string;
  distance: number;
  duration: string;
  hazards: string[];
}

export interface TradeRoute {
  id: string;
  name: string;
  type: 'maritime' | 'land';
  era: string;
  startYear: number;
  endYear: number;
  color: string;
  description: string;
  history: string;
  keyGoods: string[];
  keyLocations: string[];
  segments: TradeRouteSegment[];
  culturalImpact: string[];
  imagePrompt: string;
}

export interface CulturalInfluence {
  id: string;
  region: string;
  country: string;
  era: string;
  influenceType: 'technology' | 'aesthetic' | 'social' | 'economic';
  title: string;
  description: string;
  examples: string[];
  artifacts: string[];
  color: string;
  imagePrompt: string;
}

export interface ExportedArtifact {
  id: string;
  name: string;
  originDynasty: string;
  originKiln: string;
  discoveredIn: string;
  currentLocation: string;
  era: string;
  description: string;
  significance: string;
  material: string;
  color: string;
  imagePrompt: string;
}

export interface TradeEvent {
  id: string;
  year: number;
  yearDisplay: string;
  title: string;
  type: 'voyage' | 'treaty' | 'discovery' | 'diplomacy' | 'innovation' | 'commerce';
  location: string;
  participants: string[];
  description: string;
  impact: string;
  relatedRoutes: string[];
  relatedArtifacts: string[];
  color: string;
  imagePrompt: string;
}

export interface GlazeMineral {
  id: string;
  name: string;
  category: 'base' | 'flux' | 'colorant' | 'stabilizer';
  description: string;
  defaultRatio: number;
  minRatio: number;
  maxRatio: number;
  colorContribution: {
    r: number;
    g: number;
    b: number;
    opacity: number;
  };
  temperatureSensitivity: number;
  atmosphereEffect: 'neutral' | 'oxidize' | 'reduce';
}

export interface GlazeFormula {
  minerals: { mineralId: string; ratio: number }[];
  totalRatio: number;
}

export interface FiringCondition {
  temperature: number;
  atmosphere: 'oxidation' | 'reduction' | 'neutral';
  duration: number;
  coolingRate: 'fast' | 'medium' | 'slow';
}

export interface GlazeLabResult {
  color: string;
  lightColor: string;
  name: string;
  description: string;
  texture: 'glossy' | 'matte' | 'satin' | 'crystalline';
  translucency: number;
  crackleLevel: number;
  flowLevel: number;
}

export interface GlazeExperiment {
  id: string;
  name: string;
  formula: GlazeFormula;
  firingCondition: FiringCondition;
  result: GlazeLabResult;
  createdAt: number;
  notes: string;
}

export interface TradeData {
  routes: TradeRoute[];
  locations: TradeLocation[];
  events: TradeEvent[];
  culturalInfluences: CulturalInfluence[];
  exportedArtifacts: ExportedArtifact[];
}

export interface ExhibitItem {
  id: string;
  foundArtifactId: string;
  artifactId: string;
  order: number;
  curatorNote: string;
  spotlightTheme?: string;
}

export interface ExhibitionTheme {
  id: string;
  name: string;
  description: string;
  color: string;
  bgGradient: string;
  icon: string;
}

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  themeId: string;
  description: string;
  curatorName: string;
  exhibits: ExhibitItem[];
  createdAt: number;
  updatedAt: number;
  coverArtifacts?: string[];
}

export type CuratorViewMode = 'drafts' | 'create' | 'edit' | 'preview' | 'gallery';

export type GraphNodeType = 'dynasty' | 'kiln' | 'craft' | 'pattern' | 'shape' | 'glaze';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon?: string;
  details?: string[];
  relatedIds?: string[];
}

export type GraphRelationType = 
  | 'originated_in'
  | 'flourished_in'
  | 'uses_craft'
  | 'decorated_with'
  | 'shaped_as'
  | 'applies_glaze'
  | 'influenced'
  | 'succeeded';

export interface GraphRelation {
  id: string;
  source: string;
  target: string;
  type: GraphRelationType;
  label: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  relations: GraphRelation[];
}

export interface GraphNodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface GraphPathStep {
  nodeId: string;
  relationType?: GraphRelationType;
}

export type DetailType = 'history' | 'region' | 'shape' | 'craft' | 'timeline' | 'artifact' | 'glaze' | 'craft-evolution' | 'pottery-result' | 'restoration' | 'trade-route' | 'trade-event' | 'cultural-influence' | 'exported-artifact' | 'excavation-site' | 'excavation-artifact' | 'museum-collection' | 'exhibition' | 'exhibition-exhibit' | 'graph-node';
