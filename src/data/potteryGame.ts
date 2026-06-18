import type { ClayType, FormingMethod, FiringTemperature, PotterySelection, PotteryResult, PotteryFlaw } from '../types';
import { craftData } from './crafts';

export const clayTypes: ClayType[] = [
  {
    id: 'kaolin',
    name: '高岭土',
    description: '景德镇高岭村特产的优质瓷土，被誉为"制瓷之宝"。白度高、质地细腻，是烧制高档瓷器的首选原料。',
    color: '#F5F1E8',
    properties: {
      whiteness: 95,
      plasticity: 70,
      firingRange: [1280, 1400],
      texture: '细腻温润',
    },
    impact: {
      baseColor: '#FAF7F0',
      translucency: 90,
      texture: '莹润如玉',
    },
  },
  {
    id: 'porcelain-stone',
    name: '瓷石',
    description: '景德镇近郊出产的天然瓷石，经水碓粉碎后可直接使用。透光度好，烧成后质地坚硬。',
    color: '#E8E4D8',
    properties: {
      whiteness: 85,
      plasticity: 80,
      firingRange: [1250, 1350],
      texture: '坚硬致密',
    },
    impact: {
      baseColor: '#F0ECE0',
      translucency: 80,
      texture: '坚致细腻',
    },
  },
  {
    id: 'purple-gold',
    name: '紫金土',
    description: '含铁量较高的黏土，烧成后呈深褐或酱紫色。宋代钧窑、建窑常用此土烧制天目、兔毫等名贵釉色。',
    color: '#5E5A3A',
    properties: {
      whiteness: 30,
      plasticity: 85,
      firingRange: [1200, 1320],
      texture: '深沉古朴',
    },
    impact: {
      baseColor: '#8B7355',
      translucency: 20,
      texture: '古朴厚重',
    },
  },
  {
    id: 'pottery-clay',
    name: '陶土',
    description: '普通黏土，透气性好，适合烧制低温陶器。宜兴紫砂壶即以此类黏土制成。',
    color: '#C4A484',
    properties: {
      whiteness: 40,
      plasticity: 90,
      firingRange: [1000, 1200],
      texture: '粗犷质朴',
    },
    impact: {
      baseColor: '#D4B896',
      translucency: 10,
      texture: '质朴粗犷',
    },
  },
  {
    id: 'pearl-clay',
    name: '珍珠泥',
    description: '含有细小石英颗粒的特殊瓷土，烧成后表面会浮现如珍珠般的细小闪光点。',
    color: '#EDE8D5',
    properties: {
      whiteness: 90,
      plasticity: 65,
      firingRange: [1260, 1340],
      texture: '珠光宝气',
    },
    impact: {
      baseColor: '#F8F3E8',
      translucency: 75,
      texture: '珠光隐现',
    },
  },
];

export const formingMethods: FormingMethod[] = [
  {
    id: 'wheel-throwing',
    name: '手工拉坯',
    description: '千年传统技艺，在旋转的辘轳车上以双手拉制器型。每件作品都独一无二，充满手工温度。',
    icon: 'wheel',
    properties: {
      regularity: 70,
      artistry: 95,
      uniqueness: 90,
      difficulty: 85,
    },
    typicalShapes: ['梅瓶', '玉壶春', '天球瓶', '大碗'],
  },
  {
    id: 'slip-casting',
    name: '注浆成型',
    description: '将泥浆注入石膏模具，利用石膏吸水性使坯体成型。适合批量生产，器型规整一致。',
    icon: 'pour',
    properties: {
      regularity: 95,
      artistry: 40,
      uniqueness: 20,
      difficulty: 40,
    },
    typicalShapes: ['茶杯', '盖碗', '文房用具'],
  },
  {
    id: 'hand-pinching',
    name: '手工捏塑',
    description: '纯手工捏制，不借助辘轳或模具。最古老的制陶方法，作品充满原始艺术气息。',
    icon: 'hand',
    properties: {
      regularity: 30,
      artistry: 100,
      uniqueness: 100,
      difficulty: 75,
    },
    typicalShapes: ['仿生器', '摆件', '小茶宠'],
  },
  {
    id: 'mold-pressing',
    name: '模具压制',
    description: '将泥料放入陶模中压制成型，适合制作有复杂浮雕或纹饰的器物。',
    icon: 'mold',
    properties: {
      regularity: 85,
      artistry: 60,
      uniqueness: 40,
      difficulty: 55,
    },
    typicalShapes: ['仿古铜器', '浮雕文房', '瓦当'],
  },
  {
    id: 'coiling',
    name: '泥条盘筑',
    description: '将泥搓成条，一圈圈盘筑成器型。新石器时代即已使用的古老技法，器物有明显的手工痕迹。',
    icon: 'coil',
    properties: {
      regularity: 50,
      artistry: 90,
      uniqueness: 95,
      difficulty: 70,
    },
    typicalShapes: ['陶罐', '粗陶碗', '艺术陶'],
  },
];

export const firingTemperatures: FiringTemperature[] = [
  {
    id: 'low',
    name: '低温烧',
    range: [1100, 1200],
    description: '温度较低，釉色鲜艳但瓷化程度不高。适合烧制陶土器和低温色釉。',
    color: '#E8B860',
    properties: {
      porcelainization: 30,
      hardness: 40,
      glazeVibrancy: 95,
      riskFactor: 20,
    },
  },
  {
    id: 'medium',
    name: '中温烧',
    range: [1200, 1280],
    description: '平衡之选，瓷化程度适中，釉色温润。大多数日常用瓷采用此温度烧制。',
    color: '#C97B48',
    properties: {
      porcelainization: 70,
      hardness: 75,
      glazeVibrancy: 80,
      riskFactor: 40,
    },
  },
  {
    id: 'high',
    name: '高温烧',
    range: [1280, 1350],
    description: '瓷化程度高，胎质坚密，釉色莹润如玉。景德镇高档白瓷多采用此温度。',
    color: '#A83232',
    properties: {
      porcelainization: 90,
      hardness: 90,
      glazeVibrancy: 70,
      riskFactor: 60,
    },
  },
  {
    id: 'extreme',
    name: '超高温烧',
    range: [1350, 1420],
    description: '接近瓷土熔点的极限温度，极易变形开裂。成功者胎如凝脂，釉如堆脂，是可遇不可求的神品。',
    color: '#6B1F1F',
    properties: {
      porcelainization: 100,
      hardness: 100,
      glazeVibrancy: 50,
      riskFactor: 90,
    },
  },
];

const flawLibrary: PotteryFlaw[] = [
  { name: '缩釉', description: '釉面局部收缩，露出胎骨', severity: 'minor' },
  { name: '落渣', description: '窑内杂质落在釉面上', severity: 'minor' },
  { name: '毛孔', description: '釉面有细小凹点如毛孔', severity: 'minor' },
  { name: '变形', description: '器型扭曲不规整', severity: 'major' },
  { name: '开裂', description: '胎釉开裂', severity: 'major' },
  { name: '流釉', description: '釉层下流堆积', severity: 'major' },
  { name: '脱釉', description: '釉层大片脱落', severity: 'fatal' },
  { name: '炸坯', description: '胎体炸裂', severity: 'fatal' },
  { name: '塌底', description: '器底塌陷', severity: 'fatal' },
];

const randomFlaw = (flaws: PotteryFlaw[], risk: number, count: number): PotteryFlaw[] => {
  const result: PotteryFlaw[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() * 100 < risk) {
      const flaw = flaws[Math.floor(Math.random() * flaws.length)];
      if (!result.find(f => f.name === flaw.name)) {
        result.push(flaw);
      }
    }
  }
  return result;
};

const getGrade = (score: number): PotteryResult['qualityGrade'] => {
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

export const firePottery = (selection: PotterySelection): PotteryResult | null => {
  if (!selection.clay || !selection.formingMethod || !selection.glaze || !selection.temperature) {
    return null;
  }

  const { clay, formingMethod, glaze, temperature } = selection;

  const tempInRange = temperature.range[0] >= clay.properties.firingRange[0] &&
                     temperature.range[1] <= clay.properties.firingRange[1];
  const tempMatchScore = tempInRange ? 20 : Math.max(0, 20 - Math.abs(temperature.range[0] - clay.properties.firingRange[0]) / 10);

  const difficultyBonus = (100 - formingMethod.properties.difficulty) * 0.1;

  const glazeGlazes = craftData.glazes;
  const glazeIndex = glazeGlazes.findIndex(g => g.name === glaze.name);
  const tempForGlaze = glazeIndex >= 0 && glazeIndex < 3 ? temperature.range[0] >= 1280 : true;
  const glazeMatchScore = tempForGlaze ? 25 : Math.max(0, 25 - Math.abs(temperature.range[0] - 1280) / 5);

  const baseScore =
    clay.properties.whiteness * 0.15 +
    formingMethod.properties.regularity * 0.15 +
    formingMethod.properties.artistry * 0.1 +
    glazeMatchScore +
    tempMatchScore +
    difficultyBonus;

  const randomFactor = Math.random() * 20 - 10;
  let finalScore = Math.round(Math.max(0, Math.min(100, baseScore + randomFactor)));

  const flaws = randomFlaw(flawLibrary, temperature.properties.riskFactor, 3);

  const flawPenalty = flaws.reduce((sum, flaw) => {
    if (flaw.severity === 'minor') return sum + 3;
    if (flaw.severity === 'major') return sum + 10;
    return sum + 50;
  }, 0);
  finalScore = Math.max(0, finalScore - flawPenalty);

  const grade = getGrade(finalScore);

  const primaryColor = mixColors(clay.impact.baseColor, glaze.color, 0.6);
  const secondaryColor = mixColors(primaryColor, glaze.lightColor, 0.4);

  const hasKilnChange = Math.random() < 0.15 && temperature.properties.riskFactor > 50;

  const glazeEffect = hasKilnChange
    ? `窑变奇观！${glaze.name}在高温下发生神奇变化，${glaze.description.split('。')[0]}，又平添几分意外之美`
    : `${glaze.name}呈现${glaze.description.split('。')[0]}，${clay.impact.texture}`;

  const colorDescription = hasKilnChange
    ? `釉色变幻莫测，${primaryColor}与${secondaryColor}交织辉映，如晚霞流云，美不胜收`
    : `${glaze.name}纯正，胎质${clay.properties.texture}，釉面${clay.impact.texture}`;

  const shapeQuality = formingMethod.properties.regularity > 80
    ? '器型规整端正，线条流畅优美，一丝不苟'
    : formingMethod.properties.regularity > 60
    ? '器型基本端正，手工痕迹明显，别具韵味'
    : '器型拙朴自然，手工意趣盎然，古意盎然';

  const uniqueness = hasKilnChange
    ? '举世无双的窑变神品，可遇不可求，价值连城'
    : formingMethod.properties.uniqueness > 80
    ? `纯手工打造，每件${formingMethod.name}作品都是孤品`
    : '做工精良，品质上乘';

  const features = [
    `${clay.name}胎质${clay.properties.texture}`,
    `${formingMethod.name}成型，${shapeQuality.split('，')[0]}`,
    `${glaze.name}釉色${glaze.description.split('。')[0].slice(0, 20)}`,
    `${temperature.name}${temperature.range[0]}-${temperature.range[1]}°C烧成`,
    hasKilnChange ? '罕见窑变效果' : `釉色${glaze.name === '天青釉' ? '淡雅' : glaze.name === '霁红釉' ? '浓艳' : '纯正'}`,
  ].filter(Boolean);

  const stories: Record<string, string> = {
    '精品': `这件${glaze.name}瓷器堪称精品。以${clay.name}为胎，经${formingMethod.name}成型，在${temperature.name}的烈火中涅槃而生。釉色莹润如玉，器型端庄大气，是匠人匠心与火之艺术的完美结晶。`,
    '佳品': `这件${glaze.name}瓷器品质上佳。${clay.name}的胎质${clay.properties.texture}，${formingMethod.name}的工艺恰到好处，虽非完美无瑕，但处处可见匠人用心，是一件值得珍藏的佳品。`,
    '合格品': `这件${glaze.name}瓷器是合格的实用器。虽然${flaws.length > 0 ? '有细微的' + flaws.map(f => f.name).join('、') : '略有瑕疵'}，但不影响使用，体现了制瓷过程的真实不易。`,
    '次品': `这件瓷器未能达到预期标准。${flaws.length > 0 ? '存在' + flaws.map(f => f.name).join('、') + '等缺陷' : '烧制过程中出现意外'}，虽有遗憾，但也是制瓷之路的宝贵经验。`,
    '废品': `这件瓷器在烧制中不幸损毁。${flaws.length > 0 ? flaws.find(f => f.severity === 'fatal')?.description || '严重的缺陷导致无法挽救' : '火侯掌控失当'}，令人惋惜。正所谓"一将功成万骨枯"，佳器难得。`,
  };

  const references: Record<string, string> = {
    '高岭土': '景德镇高岭村的高岭土自元代以来就是皇家御窑的指定原料，被誉为"白金"',
    '瓷石': '景德镇近郊的瓷石是宋代影青瓷的主要原料，"村村陶埏，处处窑火"',
    '紫金土': '宋代建窑以紫金土烧制兔毫盏，"兔毫紫瓯新，蟹眼清泉煮"',
    '陶土': '宜兴紫砂陶土"五色土"烧制的紫砂壶"泡茶不走味，贮茶不变色"',
    '珍珠泥': '清代雍正官窑曾以珍珠泥烧制仿汝釉器，釉面隐现珍珠光泽',
  };

  const story = stories[grade];
  const historicalReference = references[clay.id] || '制瓷技艺千年传承，每一件瓷器都是中华文化的载体';

  const imagePrompt = `A beautiful Chinese ceramic ${formingMethod.typicalShapes[0] || 'vase'} with ${glaze.name} glaze, ${clay.impact.texture} texture, ${colorDescription}, ${hasKilnChange ? 'with rare kiln transformation effects' : ''}, Jingdezhen porcelain style, museum quality, soft lighting, elegant composition`;

  return {
    id: `pottery-${Date.now()}`,
    overallScore: finalScore,
    qualityGrade: grade,
    glazeEffect,
    colorDescription,
    shapeQuality,
    uniqueness,
    flaws,
    features,
    finalAppearance: {
      primaryColor,
      secondaryColor,
      pattern: hasKilnChange ? '窑变斑纹' : glaze.name,
      texture: clay.impact.texture,
    },
    story,
    historicalReference,
    imagePrompt,
  };
};
