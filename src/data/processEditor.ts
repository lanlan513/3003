import type { ProcessStep, ProcessNode, ProcessEditorResult, ProcessEffect, PotteryFlaw } from '../types';
import { craftData } from './crafts';

export const processSteps: ProcessStep[] = [
  {
    id: 'knead-clay',
    name: '练泥',
    category: 'preparation',
    icon: 'knead',
    color: '#C4A484',
    description: '反复揉压陶泥，排除气泡，使泥料均匀柔软。常用手法有菊花揉、羊头揉、螺旋揉等。',
    shortDescription: '揉压陶泥，排除气泡',
    effect: {
      qualityBonus: 12,
      artistryBonus: 0,
      uniquenessBonus: 0,
      riskFactor: -5,
      glazeInfluence: 0,
      colorShift: 0,
      textureChange: 5,
    },
    repeatable: false,
    duration: '约30分钟',
    difficulty: 55,
    tips: '揉泥讲究"软、熟、透"，手劲均匀，揉至泥团温暖柔和为止。',
  },
  {
    id: 'age-clay',
    name: '陈腐',
    category: 'preparation',
    icon: 'knead',
    color: '#8B7355',
    description: '将揉好的泥料密封存放数月甚至数年，让水分均匀分布，泥性稳定。陈腐越久，成品越不易变形开裂。',
    shortDescription: '密封存放，稳定泥性',
    effect: {
      qualityBonus: 8,
      artistryBonus: 0,
      uniquenessBonus: 2,
      riskFactor: -8,
      glazeInfluence: 0,
      colorShift: 0,
      textureChange: 3,
    },
    repeatable: false,
    duration: '数月至数年',
    difficulty: 20,
    tips: '陈腐是老艺人的秘诀，时间越长，泥料越"听话"。',
  },
  {
    id: 'wheel-throwing',
    name: '拉坯',
    category: 'forming',
    icon: 'wheel',
    color: '#2C3E50',
    description: '在旋转的辘轳车上以双手拉制器型。随转盘旋转，以手推、提、压、收等手法，拉制出碗、盘、瓶、罐等各种器型。',
    shortDescription: '转盘之上，巧手拉制',
    effect: {
      qualityBonus: 5,
      artistryBonus: 20,
      uniquenessBonus: 15,
      riskFactor: 10,
      glazeInfluence: 0,
      colorShift: 0,
      textureChange: 8,
    },
    requiredBefore: ['knead-clay'],
    repeatable: false,
    duration: '约20分钟/件',
    difficulty: 90,
    tips: '拉坯讲究"眼准、手稳、心定"，全凭手感经验。',
  },
  {
    id: 'hand-pinch',
    name: '捏塑',
    category: 'forming',
    icon: 'wheel',
    color: '#5E4A3A',
    description: '纯手工捏制成型，不借助辘轳或模具。最古老的制陶方法，作品充满原始艺术气息和手工温度。',
    shortDescription: '纯手工捏制，古拙自然',
    effect: {
      qualityBonus: 0,
      artistryBonus: 25,
      uniquenessBonus: 25,
      riskFactor: 15,
      glazeInfluence: 0,
      colorShift: 0,
      textureChange: 15,
    },
    requiredBefore: ['knead-clay'],
    repeatable: false,
    duration: '数小时/件',
    difficulty: 75,
    tips: '捏塑之美在于拙，刻意求工反而失其韵味。',
  },
  {
    id: 'trim-body',
    name: '利坯',
    category: 'forming',
    icon: 'carve',
    color: '#6B5B4F',
    description: '坯体阴干至七八成后，置于辘轳车上精修内外，使器壁厚薄均匀，器形精准规整，线条流畅优美。',
    shortDescription: '精修坯胎，规整器型',
    effect: {
      qualityBonus: 15,
      artistryBonus: 5,
      uniquenessBonus: 0,
      riskFactor: 5,
      glazeInfluence: 2,
      colorShift: 0,
      textureChange: -5,
    },
    requiredBefore: ['wheel-throwing', 'hand-pinch'],
    repeatable: false,
    duration: '约30分钟/件',
    difficulty: 80,
    tips: '利坯关键在"听声"：刀在坯上切削的声音清脆均匀，说明厚薄一致。',
  },
  {
    id: 'bisque-firing',
    name: '素烧',
    category: 'firing',
    icon: 'fire',
    color: '#C97B48',
    description: '未施釉的坯体先经低温（约800-900°C）烧制一次，使坯体硬化，便于后续施釉和彩绘操作。',
    shortDescription: '低温烧坯，硬化胎骨',
    effect: {
      qualityBonus: 8,
      artistryBonus: 0,
      uniquenessBonus: 0,
      riskFactor: -3,
      glazeInfluence: 5,
      colorShift: 0,
      textureChange: 2,
    },
    requiredBefore: ['trim-body'],
    repeatable: false,
    duration: '约10小时',
    difficulty: 40,
    tips: '素烧后的坯体吸水性好，施釉更均匀。',
  },
  {
    id: 'carve-pattern',
    name: '刻花',
    category: 'decoration',
    icon: 'carve',
    color: '#8BA888',
    description: '以竹刀或铁刀在半干的坯体上刻划纹饰，线条深浅起伏，烧成后釉层厚薄不均，呈现出立体感和层次感。',
    shortDescription: '刀刻纹饰，层次分明',
    effect: {
      qualityBonus: 3,
      artistryBonus: 18,
      uniquenessBonus: 12,
      riskFactor: 8,
      glazeInfluence: 10,
      colorShift: 0,
      textureChange: 10,
    },
    requiredBefore: ['trim-body', 'bisque-firing'],
    repeatable: true,
    duration: '数小时',
    difficulty: 85,
    tips: '刻花讲究"线流畅、底平整、深浅有度"，刀如笔走。',
  },
  {
    id: 'incise-pattern',
    name: '划花',
    category: 'decoration',
    icon: 'carve',
    color: '#7BA3A8',
    description: '用针状工具在坯体上划出纤细的线条纹饰，线条流畅飘逸，含蓄内敛，是宋代定窑、耀州窑的典型装饰手法。',
    shortDescription: '针划细线，飘逸含蓄',
    effect: {
      qualityBonus: 5,
      artistryBonus: 15,
      uniquenessBonus: 10,
      riskFactor: 5,
      glazeInfluence: 8,
      colorShift: 0,
      textureChange: 5,
    },
    requiredBefore: ['trim-body', 'bisque-firing'],
    repeatable: true,
    duration: '约1-2小时',
    difficulty: 70,
    tips: '划花线条细若游丝，需要极高的手稳度和耐心。',
  },
  {
    id: 'print-pattern',
    name: '印花',
    category: 'decoration',
    icon: 'carve',
    color: '#6B8E8B',
    description: '用刻有纹饰的陶模在坯体上压印花纹，纹饰规整统一。宋代定窑印花最为精美，纹饰繁密而不乱。',
    shortDescription: '模压纹饰，规整统一',
    effect: {
      qualityBonus: 8,
      artistryBonus: 10,
      uniquenessBonus: -5,
      riskFactor: 3,
      glazeInfluence: 6,
      colorShift: 0,
      textureChange: 6,
    },
    requiredBefore: ['trim-body', 'bisque-firing'],
    repeatable: true,
    duration: '约30分钟',
    difficulty: 50,
    tips: '印花的关键在于力度均匀，一次成型，不可重印。',
  },
  {
    id: 'underglaze-blue',
    name: '青花',
    category: 'decoration',
    icon: 'brush',
    color: '#2C3E50',
    description: '以氧化钴料在素坯上绘画纹饰，罩透明釉后高温一次烧成。蓝白相映，永不褪色，是景德镇最具代表性的装饰手法。',
    shortDescription: '釉下蓝彩，清雅永恒',
    effect: {
      qualityBonus: 5,
      artistryBonus: 22,
      uniquenessBonus: 15,
      riskFactor: 12,
      glazeInfluence: 15,
      colorShift: -10,
      textureChange: 0,
    },
    requiredBefore: ['bisque-firing'],
    requiredAfter: ['apply-glaze'],
    repeatable: true,
    duration: '数小时至数日',
    difficulty: 95,
    tips: '青花料"火前黑、火后蓝"，绘画时呈灰黑色，经高温还原焰烧成才呈现艳丽的蓝色。',
  },
  {
    id: 'underglaze-red',
    name: '釉里红',
    category: 'decoration',
    icon: 'brush',
    color: '#A83232',
    description: '以氧化铜为着色剂在坯体上绘画，罩釉后高温烧成红色纹饰。烧成难度极大，红色纯正者百里挑一，是元代创烧的名贵品种。',
    shortDescription: '釉下红彩，难得珍品',
    effect: {
      qualityBonus: 0,
      artistryBonus: 25,
      uniquenessBonus: 20,
      riskFactor: 25,
      glazeInfluence: 15,
      colorShift: 15,
      textureChange: 0,
    },
    requiredBefore: ['bisque-firing'],
    requiredAfter: ['apply-glaze'],
    repeatable: true,
    duration: '数小时',
    difficulty: 98,
    tips: '釉里红对温度和气氛极为敏感，"窑变"时有发生，成功者便是珍品。',
  },
  {
    id: 'dip-glaze',
    name: '蘸釉',
    category: 'glazing',
    icon: 'glaze',
    color: '#8BA888',
    description: '将坯体浸入釉缸中，使釉浆均匀附着于坯面。是最传统的施釉方法，适合小型器物，釉层均匀饱满。',
    shortDescription: '浸釉挂浆，均匀饱满',
    effect: {
      qualityBonus: 10,
      artistryBonus: 5,
      uniquenessBonus: 0,
      riskFactor: 5,
      glazeInfluence: 20,
      colorShift: 5,
      textureChange: 3,
    },
    requiredBefore: ['bisque-firing', 'carve-pattern', 'incise-pattern', 'print-pattern', 'underglaze-blue', 'underglaze-red'],
    repeatable: false,
    duration: '数秒/件',
    difficulty: 60,
    tips: '蘸釉速度要快而准，"一提一浸"之间，釉层厚度便已决定。',
  },
  {
    id: 'pour-glaze',
    name: '浇釉',
    category: 'glazing',
    icon: 'glaze',
    color: '#7BA3A8',
    description: '将釉浆从器物上方浇淋而下，适合大型器物。需要经验丰富的匠人操作，才能保证釉层厚薄均匀。',
    shortDescription: '淋釉于器，适合大件',
    effect: {
      qualityBonus: 8,
      artistryBonus: 8,
      uniquenessBonus: 5,
      riskFactor: 10,
      glazeInfluence: 18,
      colorShift: 6,
      textureChange: 5,
    },
    requiredBefore: ['bisque-firing', 'carve-pattern', 'incise-pattern', 'print-pattern', 'underglaze-blue', 'underglaze-red'],
    repeatable: false,
    duration: '约1分钟/件',
    difficulty: 75,
    tips: '浇釉讲究一气呵成，最忌中途停顿，否则会留下釉痕。',
  },
  {
    id: 'brush-glaze',
    name: '刷釉',
    category: 'glazing',
    icon: 'brush',
    color: '#C9A962',
    description: '以毛刷蘸釉浆涂刷坯体，适合方器、异形器等不易浸蘸的器物。可多层施釉，釉层厚重。',
    shortDescription: '毛刷涂釉，厚薄随心',
    effect: {
      qualityBonus: 6,
      artistryBonus: 10,
      uniquenessBonus: 8,
      riskFactor: 8,
      glazeInfluence: 15,
      colorShift: 8,
      textureChange: 8,
    },
    requiredBefore: ['bisque-firing', 'carve-pattern', 'incise-pattern', 'print-pattern', 'underglaze-blue', 'underglaze-red'],
    repeatable: true,
    duration: '约5分钟/件',
    difficulty: 55,
    tips: '刷釉笔痕是独特的装饰效果，刻意消除反而不美。',
  },
  {
    id: 'blow-glaze',
    name: '吹釉',
    category: 'glazing',
    icon: 'glaze',
    color: '#5E8BA8',
    description: '以竹管蒙纱布，口吹釉浆使之均匀附着于坯面。明代始创，适合薄胎器和精致器物，釉层极薄而均匀。',
    shortDescription: '口吹薄釉，细腻如脂',
    effect: {
      qualityBonus: 12,
      artistryBonus: 8,
      uniquenessBonus: 5,
      riskFactor: 15,
      glazeInfluence: 22,
      colorShift: 3,
      textureChange: 2,
    },
    requiredBefore: ['bisque-firing', 'carve-pattern', 'incise-pattern', 'print-pattern', 'underglaze-blue', 'underglaze-red'],
    repeatable: true,
    duration: '约10分钟/件',
    difficulty: 85,
    tips: '吹釉全凭气息匀稳，"一口吹到底，中间不换气"是老艺人的诀窍。',
  },
  {
    id: 'kiln-fire',
    name: '柴烧',
    category: 'firing',
    icon: 'kiln',
    color: '#A83232',
    description: '以马尾松为燃料，在传统柴窑中烧成。松油落于釉面形成自然灰釉，每一件都是独一无二的窑变神品。',
    shortDescription: '松柴烧制，窑变天成',
    effect: {
      qualityBonus: 5,
      artistryBonus: 20,
      uniquenessBonus: 25,
      riskFactor: 30,
      glazeInfluence: 25,
      colorShift: 20,
      textureChange: 15,
    },
    requiredBefore: ['dip-glaze', 'pour-glaze', 'brush-glaze', 'blow-glaze'],
    repeatable: false,
    duration: '三天三夜',
    difficulty: 95,
    tips: '柴窑是"火的艺术"，七分人力三分火，入窑一色，出窑万彩。',
  },
  {
    id: 'gas-fire',
    name: '气烧',
    category: 'firing',
    icon: 'fire',
    color: '#C97B48',
    description: '以天然气或液化气为燃料的现代窑炉烧制。温度可控，稳定性高，成品率高，但缺少柴窑的自然韵味。',
    shortDescription: '气窑烧制，稳定可控',
    effect: {
      qualityBonus: 18,
      artistryBonus: 5,
      uniquenessBonus: -5,
      riskFactor: 10,
      glazeInfluence: 15,
      colorShift: 5,
      textureChange: 0,
    },
    requiredBefore: ['dip-glaze', 'pour-glaze', 'brush-glaze', 'blow-glaze'],
    repeatable: false,
    duration: '约12小时',
    difficulty: 50,
    tips: '气窑胜在稳定，釉色纯正均匀，适合精细作品。',
  },
  {
    id: 'reduction-fire',
    name: '还原烧',
    category: 'firing',
    icon: 'fire',
    color: '#6B1F1F',
    description: '在高温阶段控制窑内氧气不足，使釉料中的金属氧化物还原呈现特定颜色。天青、霁红、釉里红等名贵釉色都需要还原焰烧成。',
    shortDescription: '缺氧气氛，釉色神奇',
    effect: {
      qualityBonus: 8,
      artistryBonus: 15,
      uniquenessBonus: 15,
      riskFactor: 25,
      glazeInfluence: 25,
      colorShift: 25,
      textureChange: 5,
    },
    requiredBefore: ['dip-glaze', 'pour-glaze', 'brush-glaze', 'blow-glaze'],
    repeatable: false,
    duration: '约15小时',
    difficulty: 90,
    tips: '还原焰的把控是把桩师傅的绝活，"火色变白，一千三"全凭经验。',
  },
  {
    id: 'oxidation-fire',
    name: '氧化烧',
    category: 'firing',
    icon: 'fire',
    color: '#E8B860',
    description: '窑内氧气充足的烧成气氛。适合烧制三彩、五彩等低温釉彩，釉色鲜艳明亮。',
    shortDescription: '富氧气氛，釉色鲜亮',
    effect: {
      qualityBonus: 12,
      artistryBonus: 8,
      uniquenessBonus: 0,
      riskFactor: 8,
      glazeInfluence: 18,
      colorShift: 10,
      textureChange: 0,
    },
    requiredBefore: ['dip-glaze', 'pour-glaze', 'brush-glaze', 'blow-glaze'],
    repeatable: false,
    duration: '约10小时',
    difficulty: 45,
    tips: '氧化焰气氛稳定，釉色容易控制，适合初学者。',
  },
  {
    id: 'overglaze-color',
    name: '粉彩',
    category: 'decoration',
    icon: 'brush',
    color: '#E88890',
    description: '在烧好的白瓷釉面上施彩，经低温（约700-800°C）二次烧成。色彩柔和淡雅，层次丰富，有"粉润"之感，雍正乾隆时期最为鼎盛。',
    shortDescription: '釉上彩绘，粉润柔和',
    effect: {
      qualityBonus: 5,
      artistryBonus: 22,
      uniquenessBonus: 15,
      riskFactor: 10,
      glazeInfluence: 10,
      colorShift: 20,
      textureChange: 5,
    },
    requiredBefore: ['kiln-fire', 'gas-fire', 'reduction-fire', 'oxidation-fire'],
    repeatable: true,
    duration: '数日至数周',
    difficulty: 92,
    tips: '粉彩讲究"洗、染、点、拍"，层次过渡要柔和自然。',
  },
  {
    id: 'gold-tracer',
    name: '描金',
    category: 'finishing',
    icon: 'brush',
    color: '#C9A962',
    description: '以金粉或金水在瓷器上描绘纹饰，经低温烘烤后金彩附着牢固。华丽典雅，是高档瓷器常见的装饰手法。',
    shortDescription: '金彩描绘，华丽典雅',
    effect: {
      qualityBonus: 8,
      artistryBonus: 15,
      uniquenessBonus: 10,
      riskFactor: 5,
      glazeInfluence: 5,
      colorShift: 15,
      textureChange: 0,
    },
    requiredBefore: ['kiln-fire', 'gas-fire', 'reduction-fire', 'oxidation-fire', 'overglaze-color'],
    repeatable: true,
    duration: '数小时',
    difficulty: 80,
    tips: '描金金线要"匀、细、亮"，一气呵成，切忌犹豫停顿。',
  },
  {
    id: 'inspection',
    name: '选瓷',
    category: 'finishing',
    icon: 'inspect',
    color: '#2C3E50',
    description: '开窑后逐件检查，甄选佳器，剔除瑕疵。有"冲、裂、磕、缺、落渣、缩釉"等瑕疵的一律淘汰。',
    shortDescription: '甄选佳器，剔除瑕疵',
    effect: {
      qualityBonus: 15,
      artistryBonus: 0,
      uniquenessBonus: 0,
      riskFactor: -10,
      glazeInfluence: 0,
      colorShift: 0,
      textureChange: 0,
    },
    requiredBefore: ['kiln-fire', 'gas-fire', 'reduction-fire', 'oxidation-fire', 'overglaze-color', 'gold-tracer'],
    repeatable: false,
    duration: '数日',
    difficulty: 65,
    tips: '选瓷看"一釉二形三火"，三者俱佳方为上品。',
  },
];

const categoryLabels: Record<string, string> = {
  preparation: '备料',
  forming: '成型',
  decoration: '装饰',
  glazing: '施釉',
  firing: '烧制',
  finishing: '收尾',
};

export const getCategoryLabel = (category: string): string => categoryLabels[category] || category;

const flawLibrary: PotteryFlaw[] = [
  { name: '缩釉', description: '釉面局部收缩，露出胎骨', severity: 'minor' },
  { name: '落渣', description: '窑内杂质落在釉面上', severity: 'minor' },
  { name: '毛孔', description: '釉面有细小凹点如毛孔', severity: 'minor' },
  { name: '针孔', description: '釉面有微小孔洞', severity: 'minor' },
  { name: '变形', description: '器型扭曲不规整', severity: 'major' },
  { name: '开裂', description: '胎釉开裂', severity: 'major' },
  { name: '流釉', description: '釉层下流堆积', severity: 'major' },
  { name: '釉泡', description: '釉面有气泡凸起', severity: 'major' },
  { name: '脱釉', description: '釉层大片脱落', severity: 'fatal' },
  { name: '炸坯', description: '胎体炸裂', severity: 'fatal' },
  { name: '塌底', description: '器底塌陷', severity: 'fatal' },
];

const randomFlaw = (risk: number, count: number): PotteryFlaw[] => {
  const result: PotteryFlaw[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() * 100 < risk) {
      const flaw = flawLibrary[Math.floor(Math.random() * flawLibrary.length)];
      if (!result.find(f => f.name === flaw.name)) {
        result.push(flaw);
      }
    }
  }
  return result;
};

const getGrade = (score: number): ProcessEditorResult['qualityGrade'] => {
  if (score >= 90) return '精品';
  if (score >= 75) return '佳品';
  if (score >= 60) return '合格品';
  if (score >= 40) return '次品';
  return '废品';
};

const mixColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  const hex = (c: string) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const shiftColor = (color: string, amount: number): string => {
  const hex = (c: string) => parseInt(c, 16);
  let r = hex(color.slice(1, 3));
  let g = hex(color.slice(3, 5));
  let b = hex(color.slice(5, 7));
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const simulateProcess = (
  nodes: ProcessNode[],
  baseClayColor: string = '#FAF7F0',
  baseGlazeColor: string = '#8BA888'
): ProcessEditorResult | null => {
  if (nodes.length === 0) return null;

  const sortedNodes = [...nodes].sort((a, b) => a.order - b.order);

  const totalEffects: ProcessEffect = {
    qualityBonus: 0,
    artistryBonus: 0,
    uniquenessBonus: 0,
    riskFactor: 10,
    glazeInfluence: 0,
    colorShift: 0,
    textureChange: 0,
  };

  const stepInfos: string[] = [];

  sortedNodes.forEach((node) => {
    const step = processSteps.find(s => s.id === node.stepId);
    if (!step) return;

    const intensityMult = node.intensity / 100;
    totalEffects.qualityBonus += step.effect.qualityBonus * intensityMult;
    totalEffects.artistryBonus += step.effect.artistryBonus * intensityMult;
    totalEffects.uniquenessBonus += step.effect.uniquenessBonus * intensityMult;
    totalEffects.riskFactor += step.effect.riskFactor * intensityMult;
    totalEffects.glazeInfluence += step.effect.glazeInfluence * intensityMult;
    totalEffects.colorShift += step.effect.colorShift * intensityMult;
    totalEffects.textureChange += step.effect.textureChange * intensityMult;

    stepInfos.push(`${step.name}(${Math.round(node.intensity)}%)`);
  });

  totalEffects.riskFactor = Math.max(0, Math.min(100, totalEffects.riskFactor));

  let baseScore = 50;
  baseScore += totalEffects.qualityBonus * 0.8;
  baseScore += totalEffects.artistryBonus * 0.5;
  baseScore += totalEffects.uniquenessBonus * 0.3;
  baseScore -= Math.max(0, totalEffects.riskFactor - 30) * 0.3;

  const stepBonus = Math.min(sortedNodes.length * 2, 20);
  baseScore += stepBonus;

  const randomFactor = Math.random() * 20 - 10;
  let finalScore = Math.round(Math.max(0, Math.min(100, baseScore + randomFactor)));

  const flaws = randomFlaw(totalEffects.riskFactor, 3);

  const flawPenalty = flaws.reduce((sum, flaw) => {
    if (flaw.severity === 'minor') return sum + 3;
    if (flaw.severity === 'major') return sum + 10;
    return sum + 50;
  }, 0);
  finalScore = Math.max(0, finalScore - flawPenalty);

  const grade = getGrade(finalScore);

  const hasKilnChange = Math.random() < 0.12 && totalEffects.riskFactor > 50;

  let primaryColor = mixColors(baseClayColor, baseGlazeColor, 0.5 + totalEffects.glazeInfluence / 200);
  primaryColor = shiftColor(primaryColor, Math.round(totalEffects.colorShift * 0.5));
  const secondaryColor = shiftColor(primaryColor, 25);

  const textureDescriptions = [
    { threshold: -10, text: '光滑如镜' },
    { threshold: 0, text: '细腻莹润' },
    { threshold: 10, text: '温润有泽' },
    { threshold: 20, text: '肌理丰富' },
    { threshold: 100, text: '古朴粗犷' },
  ];
  const textureDesc = textureDescriptions.find(t => totalEffects.textureChange <= t.threshold)?.text || '温润有泽';

  const patternSteps = sortedNodes
    .map(n => processSteps.find(s => s.id === n.stepId))
    .filter(s => s && (s.category === 'decoration'))
    .map(s => s!.name);
  const patternDesc = patternSteps.length > 0 ? patternSteps.join('+') : (hasKilnChange ? '窑变天纹' : '素面无纹');

  const glossiness = Math.max(20, Math.min(100, 70 - totalEffects.textureChange + totalEffects.glazeInfluence * 0.3));

  const categoryCoverage = new Set(sortedNodes.map(n => {
    const step = processSteps.find(s => s.id === n.stepId);
    return step?.category;
  }));
  const isCompleteProcess = ['preparation', 'forming', 'glazing', 'firing'].every(c => categoryCoverage.has(c as any));

  const processName = sortedNodes.length > 0
    ? stepInfos.slice(0, 3).join('→') + (stepInfos.length > 3 ? '...' : '')
    : '未命名工艺';

  const features: string[] = [];
  if (isCompleteProcess) features.push('完整工艺流程');
  if (sortedNodes.length >= 8) features.push(`工序繁复（${sortedNodes.length}道工序）`);
  if (totalEffects.artistryBonus >= 50) features.push('艺术价值极高');
  if (totalEffects.uniquenessBonus >= 40) features.push('独一无二的孤品');
  if (hasKilnChange) features.push('神奇窑变效果');
  if (totalEffects.qualityBonus >= 40) features.push('品质精益求精');
  if (patternSteps.length > 0) features.push(`${patternDesc}装饰`);

  const stories: Record<string, string> = {
    '精品': `这套${processName}工艺堪称匠心独运。${sortedNodes.length}道工序环环相扣，道道精心，凝聚匠人无数心血。最终成品${textureDesc}，${patternDesc}相得益彰，是人力与天工的完美结合。`,
    '佳品': `这套工艺品质上佳。${sortedNodes.length}道工序层层递进，虽非完美无瑕，但处处可见匠心。${textureDesc}的胎釉，${patternDesc}的装饰，是一件值得珍藏的佳作。`,
    '合格品': `这套工艺流程基本完整，成品是合格的实用器。虽然${flaws.length > 0 ? '有细微的' + flaws.map(f => f.name).join('、') : '略有瑕疵'}，但体现了制瓷过程的真实不易。`,
    '次品': `这套工艺流程未能达到预期标准。${flaws.length > 0 ? '存在' + flaws.map(f => f.name).join('、') + '等缺陷' : '工艺安排有所欠缺'}，虽有遗憾，但也是探索之路上的宝贵经验。`,
    '废品': `这套工艺流程在烧制中遭遇了挫折。${flaws.length > 0 ? (flaws.find(f => f.severity === 'fatal')?.description + '，') : ''}令人惋惜。但制瓷本就是"一窑穷一窑富"的冒险，唯有屡败屡战，方能成器。`,
  };

  return {
    id: `process-${Date.now()}`,
    processName,
    overallScore: finalScore,
    qualityGrade: grade,
    totalEffects,
    stepsCount: sortedNodes.length,
    flaws,
    features,
    description: `${sortedNodes.length}道工序组合而成的陶瓷制作工艺流程，涵盖${Array.from(categoryCoverage).map(c => getCategoryLabel(c as string)).join('、')}等环节。`,
    finalAppearance: {
      primaryColor,
      secondaryColor,
      texture: textureDesc,
      pattern: patternDesc,
      glossiness: Math.round(glossiness),
    },
    story: stories[grade],
  };
};

export const getDefaultFlow = (): ProcessNode[] => [
  { instanceId: 'n1', stepId: 'knead-clay', order: 0, intensity: 100 },
  { instanceId: 'n2', stepId: 'wheel-throwing', order: 1, intensity: 100 },
  { instanceId: 'n3', stepId: 'trim-body', order: 2, intensity: 100 },
  { instanceId: 'n4', stepId: 'carve-pattern', order: 3, intensity: 80 },
  { instanceId: 'n5', stepId: 'dip-glaze', order: 4, intensity: 100 },
  { instanceId: 'n6', stepId: 'reduction-fire', order: 5, intensity: 100 },
  { instanceId: 'n7', stepId: 'inspection', order: 6, intensity: 100 },
];
