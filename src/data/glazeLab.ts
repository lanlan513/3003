import type { GlazeMineral, GlazeFormula, FiringCondition, GlazeLabResult } from '../types';

export const glazeMinerals: GlazeMineral[] = [
  {
    id: 'quartz',
    name: '石英',
    category: 'base',
    description: '釉料主体成分，提供玻璃质基体，增加釉面硬度与光泽',
    defaultRatio: 30,
    minRatio: 10,
    maxRatio: 50,
    colorContribution: { r: 255, g: 255, b: 250, opacity: 0.3 },
    temperatureSensitivity: 0.2,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'feldspar',
    name: '长石',
    category: 'base',
    description: '天然助熔剂，降低烧成温度，促进釉面熔融玻化',
    defaultRatio: 25,
    minRatio: 10,
    maxRatio: 45,
    colorContribution: { r: 250, g: 248, b: 240, opacity: 0.2 },
    temperatureSensitivity: 0.5,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'kaolin',
    name: '高岭土',
    category: 'stabilizer',
    description: '悬浮稳定剂，防止釉浆沉淀，提高釉层附着性',
    defaultRatio: 10,
    minRatio: 0,
    maxRatio: 25,
    colorContribution: { r: 255, g: 252, b: 248, opacity: 0.4 },
    temperatureSensitivity: 0.1,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'limestone',
    name: '石灰石',
    category: 'flux',
    description: '传统助熔剂，降低釉的熔融温度，增加釉面透明度',
    defaultRatio: 15,
    minRatio: 0,
    maxRatio: 30,
    colorContribution: { r: 252, g: 250, b: 245, opacity: 0.15 },
    temperatureSensitivity: 0.6,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'iron_oxide',
    name: '氧化铁',
    category: 'colorant',
    description: '最古老的着色剂，氧化焰呈黄褐色，还原焰呈青绿色',
    defaultRatio: 3,
    minRatio: 0,
    maxRatio: 15,
    colorContribution: { r: 180, g: 80, b: 50, opacity: 0.9 },
    temperatureSensitivity: 0.8,
    atmosphereEffect: 'reduce',
  },
  {
    id: 'copper_oxide',
    name: '氧化铜',
    category: 'colorant',
    description: '氧化焰呈绿色，还原焰呈红色，是铜红釉的核心原料',
    defaultRatio: 2,
    minRatio: 0,
    maxRatio: 10,
    colorContribution: { r: 160, g: 60, b: 60, opacity: 0.85 },
    temperatureSensitivity: 0.9,
    atmosphereEffect: 'reduce',
  },
  {
    id: 'cobalt_oxide',
    name: '氧化钴',
    category: 'colorant',
    description: '青花料的核心成分，无论氧化还原均呈蓝色，着色力极强',
    defaultRatio: 1,
    minRatio: 0,
    maxRatio: 8,
    colorContribution: { r: 40, g: 60, b: 160, opacity: 0.95 },
    temperatureSensitivity: 0.3,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'manganese_oxide',
    name: '氧化锰',
    category: 'colorant',
    description: '呈褐色至紫黑色，常与其他着色剂配合使用',
    defaultRatio: 1,
    minRatio: 0,
    maxRatio: 8,
    colorContribution: { r: 100, g: 60, b: 80, opacity: 0.8 },
    temperatureSensitivity: 0.5,
    atmosphereEffect: 'oxidize',
  },
  {
    id: 'titanium_oxide',
    name: '氧化钛',
    category: 'colorant',
    description: '结晶釉的关键成分，可形成金红石结晶，产生乳浊效果',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 10,
    colorContribution: { r: 230, g: 225, b: 200, opacity: 0.6 },
    temperatureSensitivity: 0.7,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'magnesium_oxide',
    name: '氧化镁',
    category: 'stabilizer',
    description: '增加釉面乳浊感与柔滑触感，是茶叶末釉的辅助成分',
    defaultRatio: 2,
    minRatio: 0,
    maxRatio: 12,
    colorContribution: { r: 240, g: 238, b: 225, opacity: 0.3 },
    temperatureSensitivity: 0.4,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'zinc_oxide',
    name: '氧化锌',
    category: 'flux',
    description: '助熔剂兼结晶促进剂，可产生结晶釉效果',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 10,
    colorContribution: { r: 245, g: 242, b: 235, opacity: 0.2 },
    temperatureSensitivity: 0.5,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'tin_oxide',
    name: '氧化锡',
    category: 'colorant',
    description: '强效乳浊剂，使釉面呈乳白色不透明，可制白釉',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 10,
    colorContribution: { r: 250, g: 248, b: 245, opacity: 0.7 },
    temperatureSensitivity: 0.2,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'bone_ash',
    name: '骨灰',
    category: 'flux',
    description: '动物骨灰煅烧而成，磷酸钙助熔剂，使釉面温润柔和，是骨瓷核心成分',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 15,
    colorContribution: { r: 252, g: 250, b: 245, opacity: 0.35 },
    temperatureSensitivity: 0.5,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'wood_ash',
    name: '木灰',
    category: 'flux',
    description: '草木灰，最古老的天然助熔剂，含钾钙等元素，赋予自然灰釉效果',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 20,
    colorContribution: { r: 235, g: 225, b: 200, opacity: 0.25 },
    temperatureSensitivity: 0.6,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'chromium_oxide',
    name: '氧化铬',
    category: 'colorant',
    description: '呈深绿至墨绿色，着色力强且稳定，不受气氛影响',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 6,
    colorContribution: { r: 50, g: 120, b: 60, opacity: 0.9 },
    temperatureSensitivity: 0.3,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'antimony_oxide',
    name: '氧化锑',
    category: 'colorant',
    description: '低温铅釉中的黄色着色剂，可制娇黄釉，高温下易挥发',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 5,
    colorContribution: { r: 230, g: 200, b: 60, opacity: 0.75 },
    temperatureSensitivity: 0.9,
    atmosphereEffect: 'oxidize',
  },
  {
    id: 'vanadium_oxide',
    name: '氧化钒',
    category: 'colorant',
    description: '可呈黄色至绿色，与锆英石配合制钒黄，是现代陶瓷新型着色剂',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 5,
    colorContribution: { r: 210, g: 190, b: 80, opacity: 0.7 },
    temperatureSensitivity: 0.6,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'barium_carbonate',
    name: '碳酸钡',
    category: 'flux',
    description: '强效助熔剂，增加釉面光泽与亮度，可形成特殊的虹彩效果',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 8,
    colorContribution: { r: 248, g: 245, b: 240, opacity: 0.2 },
    temperatureSensitivity: 0.7,
    atmosphereEffect: 'neutral',
  },
  {
    id: 'red_clay',
    name: '紫金土',
    category: 'colorant',
    description: '含铁量高的天然黏土，是建盏兔毫釉与紫砂的核心原料，呈深褐至黑',
    defaultRatio: 0,
    minRatio: 0,
    maxRatio: 15,
    colorContribution: { r: 100, g: 50, b: 30, opacity: 0.85 },
    temperatureSensitivity: 0.5,
    atmosphereEffect: 'reduce',
  },
];

export const atmosphereOptions: { value: FiringCondition['atmosphere']; label: string; description: string; color: string }[] = [
  { value: 'oxidation', label: '氧化焰', description: '供氧充足，金属氧化物保持高价态，铁呈黄褐、铜呈绿色', color: '#E8A040' },
  { value: 'reduction', label: '还原焰', description: '缺氧燃烧，金属氧化物被还原为低价态，铁呈青绿、铜呈红色', color: '#7BA3A8' },
  { value: 'neutral', label: '中性焰', description: '空气与燃料比例平衡，金属氧化物基本不变色', color: '#8BA888' },
];

export const coolingRateOptions: { value: FiringCondition['coolingRate']; label: string; description: string }[] = [
  { value: 'fast', label: '急冷', description: '快速冷却，釉面光泽强，易产生冰裂纹' },
  { value: 'medium', label: '缓冷', description: '中等冷却速度，釉面细腻均匀' },
  { value: 'slow', label: '慢冷', description: '缓慢冷却，有利于结晶生长，可形成结晶釉' },
];

export const presetFormulas: { name: string; formula: GlazeFormula; firingCondition: FiringCondition }[] = [
  {
    name: '天青釉·汝窑',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 30 },
        { mineralId: 'feldspar', ratio: 25 },
        { mineralId: 'kaolin', ratio: 10 },
        { mineralId: 'limestone', ratio: 20 },
        { mineralId: 'iron_oxide', ratio: 3 },
        { mineralId: 'magnesium_oxide', ratio: 5 },
      ],
      totalRatio: 93,
    },
    firingCondition: {
      temperature: 1250,
      atmosphere: 'reduction',
      duration: 8,
      coolingRate: 'medium',
    },
  },
  {
    name: '霁蓝釉·宣德',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 30 },
        { mineralId: 'feldspar', ratio: 30 },
        { mineralId: 'kaolin', ratio: 10 },
        { mineralId: 'limestone', ratio: 15 },
        { mineralId: 'cobalt_oxide', ratio: 3 },
      ],
      totalRatio: 88,
    },
    firingCondition: {
      temperature: 1300,
      atmosphere: 'oxidation',
      duration: 10,
      coolingRate: 'medium',
    },
  },
  {
    name: '霁红釉·永宣',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 28 },
        { mineralId: 'feldspar', ratio: 25 },
        { mineralId: 'kaolin', ratio: 8 },
        { mineralId: 'limestone', ratio: 18 },
        { mineralId: 'copper_oxide', ratio: 3 },
        { mineralId: 'tin_oxide', ratio: 2 },
      ],
      totalRatio: 84,
    },
    firingCondition: {
      temperature: 1300,
      atmosphere: 'reduction',
      duration: 10,
      coolingRate: 'medium',
    },
  },
  {
    name: '粉青釉·龙泉',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 25 },
        { mineralId: 'feldspar', ratio: 22 },
        { mineralId: 'kaolin', ratio: 12 },
        { mineralId: 'limestone', ratio: 18 },
        { mineralId: 'iron_oxide', ratio: 2 },
        { mineralId: 'magnesium_oxide', ratio: 4 },
      ],
      totalRatio: 83,
    },
    firingCondition: {
      temperature: 1260,
      atmosphere: 'reduction',
      duration: 9,
      coolingRate: 'slow',
    },
  },
  {
    name: '茶叶末·雍正',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 28 },
        { mineralId: 'feldspar', ratio: 25 },
        { mineralId: 'kaolin', ratio: 10 },
        { mineralId: 'limestone', ratio: 15 },
        { mineralId: 'iron_oxide', ratio: 6 },
        { mineralId: 'magnesium_oxide', ratio: 6 },
        { mineralId: 'titanium_oxide', ratio: 3 },
      ],
      totalRatio: 93,
    },
    firingCondition: {
      temperature: 1280,
      atmosphere: 'oxidation',
      duration: 10,
      coolingRate: 'slow',
    },
  },
  {
    name: '甜白釉·永乐',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 30 },
        { mineralId: 'feldspar', ratio: 28 },
        { mineralId: 'kaolin', ratio: 15 },
        { mineralId: 'limestone', ratio: 15 },
        { mineralId: 'iron_oxide', ratio: 0.3 },
      ],
      totalRatio: 88.3,
    },
    firingCondition: {
      temperature: 1280,
      atmosphere: 'oxidation',
      duration: 8,
      coolingRate: 'medium',
    },
  },
  {
    name: '建盏兔毫',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 20 },
        { mineralId: 'feldspar', ratio: 18 },
        { mineralId: 'red_clay', ratio: 12 },
        { mineralId: 'iron_oxide', ratio: 8 },
        { mineralId: 'limestone', ratio: 8 },
        { mineralId: 'wood_ash', ratio: 6 },
      ],
      totalRatio: 72,
    },
    firingCondition: {
      temperature: 1350,
      atmosphere: 'reduction',
      duration: 12,
      coolingRate: 'slow',
    },
  },
  {
    name: '翠绿釉',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 28 },
        { mineralId: 'feldspar', ratio: 25 },
        { mineralId: 'kaolin', ratio: 10 },
        { mineralId: 'limestone', ratio: 15 },
        { mineralId: 'chromium_oxide', ratio: 2 },
      ],
      totalRatio: 80,
    },
    firingCondition: {
      temperature: 1260,
      atmosphere: 'oxidation',
      duration: 8,
      coolingRate: 'medium',
    },
  },
  {
    name: '自然灰釉',
    formula: {
      minerals: [
        { mineralId: 'quartz', ratio: 20 },
        { mineralId: 'feldspar', ratio: 15 },
        { mineralId: 'wood_ash', ratio: 18 },
        { mineralId: 'kaolin', ratio: 8 },
        { mineralId: 'limestone', ratio: 10 },
        { mineralId: 'iron_oxide', ratio: 1 },
      ],
      totalRatio: 72,
    },
    firingCondition: {
      temperature: 1280,
      atmosphere: 'reduction',
      duration: 10,
      coolingRate: 'slow',
    },
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(clamp(n, 0, 255)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function calculateGlazeColor(
  formula: GlazeFormula,
  firingCondition: FiringCondition
): GlazeLabResult {
  let r = 240;
  let g = 238;
  let b = 232;

  let totalWeight = 0;
  for (const item of formula.minerals) {
    totalWeight += item.ratio;
  }

  if (totalWeight === 0) {
    return {
      color: rgbToHex(r, g, b),
      lightColor: rgbToHex(Math.min(255, r + 20), Math.min(255, g + 18), Math.min(255, b + 15)),
      name: '无釉素胎',
      description: '未添加任何釉料成分',
      texture: 'matte',
      translucency: 0,
      crackleLevel: 0,
      flowLevel: 0,
    };
  }

  for (const item of formula.minerals) {
    const mineral = glazeMinerals.find((m) => m.id === item.mineralId);
    if (!mineral) continue;

    const weight = item.ratio / totalWeight;
    const cc = mineral.colorContribution;

    let atmosModifier = 1.0;
    if (mineral.atmosphereEffect === 'reduce' && firingCondition.atmosphere === 'reduction') {
      atmosModifier = 1.3;
    } else if (mineral.atmosphereEffect === 'reduce' && firingCondition.atmosphere === 'oxidation') {
      atmosModifier = 0.6;
    } else if (mineral.atmosphereEffect === 'oxidize' && firingCondition.atmosphere === 'oxidation') {
      atmosModifier = 1.2;
    } else if (mineral.atmosphereEffect === 'oxidize' && firingCondition.atmosphere === 'reduction') {
      atmosModifier = 0.7;
    }

    const tempFactor = 1.0 + (mineral.temperatureSensitivity * (firingCondition.temperature - 1200)) / 1000;

    const effectiveOpacity = cc.opacity * weight * atmosModifier * tempFactor;

    r = r * (1 - effectiveOpacity) + cc.r * effectiveOpacity;
    g = g * (1 - effectiveOpacity) + cc.g * effectiveOpacity;
    b = b * (1 - effectiveOpacity) + cc.b * effectiveOpacity;

    if (mineral.category === 'colorant') {
      const colorIntensity = weight * mineral.colorContribution.opacity * atmosModifier * 2;
      if (mineral.id === 'iron_oxide' && firingCondition.atmosphere === 'reduction') {
        r -= colorIntensity * 120;
        g += colorIntensity * 30;
        b += colorIntensity * 80;
      } else if (mineral.id === 'copper_oxide' && firingCondition.atmosphere === 'reduction') {
        r += colorIntensity * 160;
        g -= colorIntensity * 40;
        b -= colorIntensity * 40;
      } else if (mineral.id === 'copper_oxide' && firingCondition.atmosphere === 'oxidation') {
        r -= colorIntensity * 60;
        g += colorIntensity * 120;
        b -= colorIntensity * 40;
      } else if (mineral.id === 'cobalt_oxide') {
        r -= colorIntensity * 80;
        g -= colorIntensity * 40;
        b += colorIntensity * 140;
      } else if (mineral.id === 'chromium_oxide') {
        r -= colorIntensity * 80;
        g += colorIntensity * 60;
        b -= colorIntensity * 40;
      } else if (mineral.id === 'red_clay' && firingCondition.atmosphere === 'reduction') {
        r -= colorIntensity * 60;
        g -= colorIntensity * 30;
        b -= colorIntensity * 20;
      } else if (mineral.id === 'antimony_oxide' && firingCondition.atmosphere === 'oxidation') {
        r += colorIntensity * 30;
        g += colorIntensity * 20;
        b -= colorIntensity * 80;
      } else if (mineral.id === 'vanadium_oxide') {
        r += colorIntensity * 10;
        g += colorIntensity * 15;
        b -= colorIntensity * 60;
      }
    }
  }

  const baseColorants = formula.minerals.filter((item) => {
    const mineral = glazeMinerals.find((m) => m.id === item.mineralId);
    return mineral?.category === 'base' || mineral?.category === 'stabilizer';
  });
  const baseRatio = baseColorants.reduce((sum, item) => sum + item.ratio, 0) / totalWeight;
  if (baseRatio > 0.8) {
    const whiteness = (baseRatio - 0.8) * 5;
    r = r * (1 - whiteness) + 250 * whiteness;
    g = g * (1 - whiteness) + 248 * whiteness;
    b = b * (1 - whiteness) + 242 * whiteness;
  }

  const hasCobalt = formula.minerals.some((item) => item.mineralId === 'cobalt_oxide' && item.ratio > 0);
  const hasCopper = formula.minerals.some((item) => item.mineralId === 'copper_oxide' && item.ratio > 0);
  const hasIron = formula.minerals.some((item) => item.mineralId === 'iron_oxide' && item.ratio > 0);
  const hasTitanium = formula.minerals.some((item) => item.mineralId === 'titanium_oxide' && item.ratio > 0);
  const hasTin = formula.minerals.some((item) => item.mineralId === 'tin_oxide' && item.ratio > 0);
  const hasZinc = formula.minerals.some((item) => item.mineralId === 'zinc_oxide' && item.ratio > 0);
  const hasManganese = formula.minerals.some((item) => item.mineralId === 'manganese_oxide' && item.ratio > 0);

  const hasChromium = formula.minerals.some((item) => item.mineralId === 'chromium_oxide' && item.ratio > 0);
  const hasAntimony = formula.minerals.some((item) => item.mineralId === 'antimony_oxide' && item.ratio > 0);
  const hasRedClay = formula.minerals.some((item) => item.mineralId === 'red_clay' && item.ratio > 0);
  const hasVanadium = formula.minerals.some((item) => item.mineralId === 'vanadium_oxide' && item.ratio > 0);

  const ironRatio = formula.minerals.find((item) => item.mineralId === 'iron_oxide')?.ratio || 0;
  const copperRatio = formula.minerals.find((item) => item.mineralId === 'copper_oxide')?.ratio || 0;
  const cobaltRatio = formula.minerals.find((item) => item.mineralId === 'cobalt_oxide')?.ratio || 0;
  const magnesiumRatio = formula.minerals.find((item) => item.mineralId === 'magnesium_oxide')?.ratio || 0;
  const redClayRatio = formula.minerals.find((item) => item.mineralId === 'red_clay')?.ratio || 0;
  const chromiumRatio = formula.minerals.find((item) => item.mineralId === 'chromium_oxide')?.ratio || 0;
  const antimonyRatio = formula.minerals.find((item) => item.mineralId === 'antimony_oxide')?.ratio || 0;
  const vanadiumRatio = formula.minerals.find((item) => item.mineralId === 'vanadium_oxide')?.ratio || 0;

  let crackleLevel = 0;
  if (firingCondition.coolingRate === 'fast') crackleLevel += 40;
  if (firingCondition.coolingRate === 'medium') crackleLevel += 15;
  if (hasTin) crackleLevel += 20;
  if (hasCopper && firingCondition.atmosphere === 'reduction') crackleLevel += 25;
  if (hasRedClay && firingCondition.atmosphere === 'reduction') crackleLevel += 15;
  crackleLevel = clamp(crackleLevel, 0, 100);

  let flowLevel = 0;
  const fluxRatio = formula.minerals.filter((item) => {
    const m = glazeMinerals.find((min) => min.id === item.mineralId);
    return m?.category === 'flux';
  }).reduce((sum, item) => sum + item.ratio, 0) / totalWeight;
  flowLevel = fluxRatio * 200 + (firingCondition.temperature - 1200) / 10;
  if (hasCopper && copperRatio > 3) flowLevel += 30;
  flowLevel = clamp(flowLevel, 0, 100);

  let translucency = 60;
  if (hasTin) translucency -= 40;
  if (hasTitanium) translucency -= 25;
  if (hasZinc) translucency -= 15;
  if (magnesiumRatio > 3) translucency -= 15;
  if (hasRedClay && redClayRatio > 5) translucency -= 20;
  translucency = clamp(translucency, 5, 95);

  let texture: GlazeLabResult['texture'] = 'glossy';
  if (hasTitanium && firingCondition.coolingRate === 'slow') texture = 'crystalline';
  else if (magnesiumRatio > 4 && hasTitanium) texture = 'matte';
  else if (magnesiumRatio > 3) texture = 'satin';
  else if (flowLevel > 60) texture = 'glossy';

  let name = '';
  let description = '';

  if (hasCobalt && cobaltRatio >= 2) {
    if (cobaltRatio >= 4) {
      name = '深蓝釉';
      description = '深邃浓郁的蓝釉，如夜空般深沉，钴料充分发色';
    } else {
      name = firingCondition.atmosphere === 'oxidation' ? '霁蓝釉' : '宝石蓝釉';
      description = firingCondition.atmosphere === 'oxidation'
        ? '典雅庄重的霁蓝，釉面均匀沉稳，似蓝宝石般深邃'
        : '还原焰下的蓝釉，更添幽深神秘之感';
    }
  } else if (hasCopper && copperRatio >= 1.5) {
    if (firingCondition.atmosphere === 'reduction') {
      if (copperRatio <= 2) {
        name = '豇豆红釉';
        description = '淡雅柔美的铜红釉，红中泛绿苔点，如美人醉颜';
      } else if (copperRatio <= 5) {
        name = '郎窑红釉';
        description = '鲜如初凝牛血，玻璃质感强，脱口垂足郎不流';
      } else {
        name = '霁红釉';
        description = '深沉浓艳的铜红釉，如红宝石般凝重';
      }
    } else {
      name = '绿釉';
      description = '氧化焰下的铜绿，清新鲜活，是铜的另一种面貌';
    }
  } else if (hasIron && ironRatio >= 1) {
    if (firingCondition.atmosphere === 'reduction') {
      if (ironRatio <= 2) {
        name = '天青釉';
        description = '雨过天青云破处，釉色蓝中带青，柔和淡雅';
      } else if (ironRatio <= 4) {
        name = '粉青釉';
        description = '龙泉经典，青绿淡雅如玉，精光内蕴';
      } else {
        name = '梅子青釉';
        description = '铁量较高的青釉，色深如青梅，是青釉中的极品';
      }
    } else {
      if (ironRatio <= 2) {
        name = '黄釉';
        description = '氧化焰下的铁，呈温暖的黄褐色调';
      } else if (magnesiumRatio > 3) {
        name = '茶叶末釉';
        description = '暗黄绿底上散布黄褐星点，古朴典雅';
      } else {
        name = '酱釉';
        description = '铁含量较高的氧化焰呈色，深沉厚重';
      }
    }
  } else if (hasChromium && chromiumRatio >= 1) {
    if (chromiumRatio >= 3) {
      name = '墨绿釉';
      description = '铬着色的深墨绿釉，色泽沉稳内敛，如幽林深潭';
    } else {
      name = '翠绿釉';
      description = '铬着色的翠绿釉，色泽鲜亮如新叶，不受气氛影响';
    }
  } else if (hasRedClay && redClayRatio >= 3) {
    if (firingCondition.atmosphere === 'reduction') {
      name = '兔毫釉';
      description = '建盏经典釉色，铁结晶在釉面析出兔毫般细纹，神秘幽深';
    } else {
      name = '铁红釉';
      description = '紫金土在氧化焰下呈铁红色，温厚古朴';
    }
  } else if (hasAntimony && antimonyRatio >= 1.5 && firingCondition.atmosphere === 'oxidation') {
    if (firingCondition.temperature < 1100) {
      name = '娇黄釉';
      description = '锑着色的明黄釉，如鸡油般娇嫩，是低温铅釉的名品';
    } else {
      name = '淡黄釉';
      description = '锑在高温下的呈色，淡雅温和';
    }
  } else if (hasVanadium && vanadiumRatio >= 1) {
    name = '钒黄釉';
    description = '钒着色的黄绿釉，现代陶瓷新型色釉，明快清新';
  } else if (hasManganese) {
    name = '紫金釉';
    description = '锰着色的紫褐釉，庄重沉稳，有金属光泽';
  } else if (hasTitanium) {
    if (firingCondition.coolingRate === 'slow') {
      name = '结晶釉';
      description = '钛结晶在釉面绽放，如冰花似繁星，变幻万千';
    } else {
      name = '乳浊釉';
      description = '钛的乳浊效果使釉面呈现柔和的象牙白';
    }
  } else if (hasTin) {
    name = '锡白釉';
    description = '锡氧化物的强乳浊效果，釉面洁白如雪，不透明';
  } else {
    const basePurity = baseRatio;
    if (basePurity > 0.85) {
      name = '甜白釉';
      description = '纯净无暇的白釉，温润甘甜，如凝脂积雪';
    } else {
      name = '透明釉';
      description = '基础透明釉，清澈如水，可见胎色';
    }
  }

  const lightR = Math.min(255, r + 30 + (1 - translucency / 100) * 20);
  const lightG = Math.min(255, g + 28 + (1 - translucency / 100) * 18);
  const lightB = Math.min(255, b + 25 + (1 - translucency / 100) * 15);

  return {
    color: rgbToHex(r, g, b),
    lightColor: rgbToHex(lightR, lightG, lightB),
    name,
    description,
    texture,
    translucency,
    crackleLevel,
    flowLevel,
  };
}

export function createDefaultFormula(): GlazeFormula {
  return {
    minerals: [
      { mineralId: 'quartz', ratio: 30 },
      { mineralId: 'feldspar', ratio: 25 },
      { mineralId: 'kaolin', ratio: 10 },
      { mineralId: 'limestone', ratio: 15 },
    ],
    totalRatio: 80,
  };
}

export function createDefaultFiringCondition(): FiringCondition {
  return {
    temperature: 1260,
    atmosphere: 'reduction',
    duration: 8,
    coolingRate: 'medium',
  };
}

export function generateExperimentId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
