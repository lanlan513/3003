import type {
  DisasterEvent,
  DisasterType,
  DisasterSeverity,
  MitigationStrategy,
  DisasterHistoryRecord,
  DisasterReport,
} from '../types';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const disasterEventTemplates: Record<DisasterType, Omit<DisasterEvent, 'id' | 'severity' | 'baseDamage' | 'affectedItems'>[]> = {
  kiln_explosion: [
    {
      type: 'kiln_explosion',
      name: '窑炉温惊',
      description: '窑炉内温度骤变，部分瓷器因热胀冷缩不均而开裂。',
      duration: 1,
      icon: 'flame',
      color: '#A83232',
      historicalReference: '据《陶记》记载，景德镇窑工每逢窑变，必焚香祷告。温度失控往往导致一窑瓷器尽毁。',
      imagePrompt: 'Ancient Chinese ceramic kiln with smoke and fire, dramatic scene, traditional porcelain workshop, historical atmosphere',
    },
    {
      type: 'kiln_explosion',
      name: '窑裂塌陷',
      description: '窑炉年久失修，烧制过程中窑壁坍塌，大量瓷器被砸毁掩埋。',
      duration: 2,
      icon: 'flame',
      color: '#A83232',
      historicalReference: '明代御窑曾多次发生窑塌事故，损失瓷器以万计。窑砖的质量和砌筑技术至关重要。',
      imagePrompt: 'Collapsed ancient ceramic kiln with broken pottery scattered, historical disaster scene, smoky atmosphere',
    },
    {
      type: 'kiln_explosion',
      name: '窑火焚天',
      description: '火势失控，整座窑场陷入火海，成品、半成品乃至窑具一并焚毁。',
      duration: 3,
      icon: 'flame',
      color: '#A83232',
      historicalReference: '南宋时期，龙泉窑曾因山火蔓延导致整个窑区焚毁，数十年积累付之一炬。',
      imagePrompt: 'Massive fire at ancient ceramic workshop, flames engulfing kilns, dramatic historical disaster scene',
    },
  ],
  transport_damage: [
    {
      type: 'transport_damage',
      name: '路途颠簸',
      description: '陆路运输途中道路崎岖，部分瓷器因颠簸碰撞而破损。',
      duration: 1,
      icon: 'truck',
      color: '#C9A962',
      historicalReference: '古代瓷器运输多用稻草、棉絮包裹，但长途跋涉仍难免破损。"百里不贩樵，千里不贩瓷"。',
      imagePrompt: 'Ancient Chinese porcelain transportation caravan on bumpy road, traditional cargo carriers, historical scene',
    },
    {
      type: 'transport_damage',
      name: '车马倾覆',
      description: '运输马车翻倒，整箱瓷器摔落，损失惨重。',
      duration: 2,
      icon: 'truck',
      color: '#C9A962',
      historicalReference: '据《天工开物》记载，瓷器运输"十损二三"乃常事，若遇翻车则全船尽毁。',
      imagePrompt: 'Overturned ancient Chinese cart with broken porcelain scattered, historical transportation disaster',
    },
    {
      type: 'transport_damage',
      name: '山贼劫掠',
      description: '途中遭遇山贼，不仅财物被抢，部分瓷器也被砸碎或掳走。',
      duration: 2,
      icon: 'truck',
      color: '#C9A962',
      historicalReference: '古代商贸之路盗贼横行，贵重瓷器更是劫掠目标。镖局应运而生，专司贵重物品押运。',
      imagePrompt: 'Ancient Chinese bandits attacking a caravan, porcelain cargo being looted, historical drama scene',
    },
  ],
  war_looting: [
    {
      type: 'war_looting',
      name: '兵祸殃及',
      description: '战乱波及窑场，部分瓷器被士兵损毁或掠夺。',
      duration: 2,
      icon: 'swords',
      color: '#8B0000',
      historicalReference: '每遇改朝换代，官窑民窑皆受兵燹之祸。宋末元初、明末清初，陶瓷业都曾遭受重创。',
      imagePrompt: 'Ancient Chinese battlefield near ceramic workshop, soldiers and damaged pottery, war disaster scene',
    },
    {
      type: 'war_looting',
      name: '城破劫毁',
      description: '城池被攻破，府库珍藏的瓷器被大量劫掠或毁于战火。',
      duration: 3,
      icon: 'swords',
      color: '#8B0000',
      historicalReference: '1860年英法联军火烧圆明园，无数珍贵瓷器被劫掠或损毁，是中华文明的浩劫。',
      imagePrompt: 'Ancient Chinese city under siege, palace treasures being looted, porcelain scattered, historical war scene',
    },
    {
      type: 'war_looting',
      name: '窑场焚毁',
      description: '敌军纵火焚毁窑场，无数工匠心血化为灰烬。',
      duration: 3,
      icon: 'swords',
      color: '#8B0000',
      historicalReference: '金元之际，北方诸窑大多毁于战火，钧窑、定窑等名窑从此衰落，陶瓷业重心南移。',
      imagePrompt: 'Burning ancient ceramic kiln village during war, flames and destruction, historical disaster scene',
    },
  ],
  shipwreck: [
    {
      type: 'shipwreck',
      name: '海上风浪',
      description: '海运途中遭遇风浪，部分瓷器因船体摇晃而破损。',
      duration: 1,
      icon: 'waves',
      color: '#2C3E50',
      historicalReference: '古代海上丝绸之路充满风险，"南海一号"、"华光礁一号"等沉船都是明证。',
      imagePrompt: 'Ancient Chinese merchant ship in stormy sea, porcelain cargo on deck, maritime disaster scene',
    },
    {
      type: 'shipwreck',
      name: '暗礁触船',
      description: '船只触礁，海水涌入船舱，大量瓷器被水浸泡或坠入海中。',
      duration: 2,
      icon: 'waves',
      color: '#2C3E50',
      historicalReference: '南海一号沉船即因触礁沉没，船上载有数万件宋代瓷器，在海底沉睡了八百年。',
      imagePrompt: 'Ancient Chinese ship hitting a reef, breaking apart, porcelain falling into the sea, underwater scene',
    },
    {
      type: 'shipwreck',
      name: '全船覆没',
      description: '遭遇特大风暴，整艘商船沉没，所载瓷器全部沉入海底。',
      duration: 3,
      icon: 'waves',
      color: '#2C3E50',
      historicalReference: '据《宋会要辑稿》记载，宋代出使高丽的船只常常"风涛不利，多有覆没"。',
      imagePrompt: 'Sunken ancient Chinese merchant ship underwater with porcelain cargo scattered, deep sea shipwreck scene',
    },
  ],
};

export const mitigationStrategies: MitigationStrategy[] = [
  {
    id: 'kiln_inspection',
    name: '窑炉检修',
    description: '定期检查窑炉砖壁，及时修补隐患，降低窑炉爆裂风险。',
    cost: 5000,
    effectiveness: 35,
    applicableDisasters: ['kiln_explosion'],
    icon: 'wrench',
    color: '#A83232',
  },
  {
    id: 'temperature_control',
    name: '控温技术',
    description: '采用先进的测温技术，精准控制窑温，减少因温度失控造成的损失。',
    cost: 8000,
    effectiveness: 40,
    applicableDisasters: ['kiln_explosion'],
    icon: 'thermometer',
    color: '#A83232',
  },
  {
    id: 'fire_extinguisher',
    name: '防火设施',
    description: '配备水缸、沙堆等灭火器材，窑场周边开辟防火隔离带。',
    cost: 6000,
    effectiveness: 30,
    applicableDisasters: ['kiln_explosion', 'war_looting'],
    icon: 'shield',
    color: '#A83232',
  },
  {
    id: 'secure_packaging',
    name: '防震包装',
    description: '使用稻草、棉絮、木箱层层包裹，减少运输途中的碰撞损坏。',
    cost: 3000,
    effectiveness: 45,
    applicableDisasters: ['transport_damage'],
    icon: 'package',
    color: '#C9A962',
  },
  {
    id: 'escort_service',
    name: '镖师押运',
    description: '聘请专业镖局护送，提高运输安全，防范盗贼劫掠。',
    cost: 10000,
    effectiveness: 60,
    applicableDisasters: ['transport_damage', 'war_looting'],
    icon: 'shield-check',
    color: '#C9A962',
  },
  {
    id: 'alternative_route',
    name: '绕行险路',
    description: '选择更安全的路线，避开崎岖山路和盗贼出没区域，虽然路程更长但更安全。',
    cost: 4000,
    effectiveness: 35,
    applicableDisasters: ['transport_damage'],
    icon: 'route',
    color: '#C9A962',
  },
  {
    id: 'fortress_storage',
    name: '堡垒窖藏',
    description: '将珍贵瓷器藏入坚固的地下密室，可抵御战乱和火灾。',
    cost: 15000,
    effectiveness: 55,
    applicableDisasters: ['war_looting', 'kiln_explosion'],
    icon: 'castle',
    color: '#8B0000',
  },
  {
    id: 'evacuation_plan',
    name: '转移预案',
    description: '提前制定战乱转移方案，确保危急时刻能快速转移贵重藏品。',
    cost: 7000,
    effectiveness: 40,
    applicableDisasters: ['war_looting'],
    icon: 'arrow-right-circle',
    color: '#8B0000',
  },
  {
    id: 'watertight_cabin',
    name: '隔水舱设计',
    description: '运输船舱采用隔水设计，即使触礁漏水也能保住部分瓷器。',
    cost: 12000,
    effectiveness: 50,
    applicableDisasters: ['shipwreck'],
    icon: 'ship',
    color: '#2C3E50',
  },
  {
    id: 'weather_forecast',
    name: '气象观测',
    description: '聘请经验丰富的船老大，观测天象选择吉日出海，避开恶劣天气。',
    cost: 5000,
    effectiveness: 35,
    applicableDisasters: ['shipwreck'],
    icon: 'cloud',
    color: '#2C3E50',
  },
  {
    id: 'insurance',
    name: '风险共担',
    description: '与商号签订风险共担协议，损失由多方分摊，降低单一主体风险。',
    cost: 8000,
    effectiveness: 30,
    applicableDisasters: ['kiln_explosion', 'transport_damage', 'war_looting', 'shipwreck'],
    icon: 'handshake',
    color: '#8BA888',
  },
  {
    id: 'backup_inventory',
    name: '多地仓储',
    description: '在不同地点设立仓库，分散存储，避免一处受灾全部损失。',
    cost: 10000,
    effectiveness: 40,
    applicableDisasters: ['kiln_explosion', 'war_looting', 'shipwreck'],
    icon: 'warehouse',
    color: '#8BA888',
  },
];

const severityConfig: Record<DisasterSeverity, { damageMultiplier: number; itemsMultiplier: number; chance: number }> = {
  minor: { damageMultiplier: 0.3, itemsMultiplier: 0.1, chance: 0.4 },
  moderate: { damageMultiplier: 0.6, itemsMultiplier: 0.25, chance: 0.35 },
  severe: { damageMultiplier: 1.0, itemsMultiplier: 0.5, chance: 0.2 },
  catastrophic: { damageMultiplier: 1.5, itemsMultiplier: 0.75, chance: 0.05 },
};

const pickSeverity = (): DisasterSeverity => {
  const rand = Math.random();
  let cumulative = 0;
  const severities: DisasterSeverity[] = ['minor', 'moderate', 'severe', 'catastrophic'];
  
  for (const severity of severities) {
    cumulative += severityConfig[severity].chance;
    if (rand < cumulative) return severity;
  }
  return 'moderate';
};

export const generateDisasterEvent = (
  disasterType?: DisasterType
): DisasterEvent => {
  const types: DisasterType[] = ['kiln_explosion', 'transport_damage', 'war_looting', 'shipwreck'];
  const type = disasterType || types[Math.floor(Math.random() * types.length)];
  const templates = disasterEventTemplates[type];
  const template = templates[Math.floor(Math.random() * templates.length)];
  const severity = pickSeverity();
  const config = severityConfig[severity];

  return {
    id: generateId(),
    ...template,
    severity,
    baseDamage: Math.round(50 * config.damageMultiplier),
    affectedItems: Math.round(20 * config.itemsMultiplier),
  };
};

export const calculateActualDamage = (
  event: DisasterEvent,
  strategies: MitigationStrategy[],
  totalInventoryCount: number,
  totalInventoryValue: number
): {
  actualDamage: number;
  itemsLost: number;
  itemsSaved: number;
  totalValueLost: number;
  severityRating: number;
} => {
  const applicableStrategies = strategies.filter((s) =>
    s.applicableDisasters.includes(event.type)
  );

  let totalEffectiveness = 0;
  for (const strategy of applicableStrategies) {
    totalEffectiveness += strategy.effectiveness;
  }
  totalEffectiveness = Math.min(totalEffectiveness, 85);

  const damageReduction = totalEffectiveness / 100;
  const actualDamage = Math.round(event.baseDamage * (1 - damageReduction));
  const itemsLost = Math.min(
    totalInventoryCount,
    Math.round(event.affectedItems * (1 - damageReduction))
  );
  const itemsSaved = event.affectedItems - itemsLost;

  const valuePerItem = totalInventoryCount > 0 ? totalInventoryValue / totalInventoryCount : 0;
  const totalValueLost = Math.round(itemsLost * valuePerItem);

  const severityRating = Math.max(1, Math.round(actualDamage / 10));

  return {
    actualDamage,
    itemsLost,
    itemsSaved,
    totalValueLost,
    severityRating,
  };
};

export const generateDisasterReport = (
  history: DisasterHistoryRecord[]
): DisasterReport => {
  const totalEvents = history.length;

  const eventsByType: Record<DisasterType, number> = {
    kiln_explosion: 0,
    transport_damage: 0,
    war_looting: 0,
    shipwreck: 0,
  };

  let totalDamage = 0;
  let totalItemsLost = 0;
  let totalValueLost = 0;
  let worstEvent: DisasterHistoryRecord | null = null;
  let maxDamage = 0;

  const strategyEffectiveness: Record<string, { used: number; totalDamage: number }> = {};

  for (const record of history) {
    eventsByType[record.event.type]++;
    totalDamage += record.finalDamage;
    totalItemsLost += record.itemsLost;
    totalValueLost += record.totalValueLost;

    if (record.finalDamage > maxDamage) {
      maxDamage = record.finalDamage;
      worstEvent = record;
    }

    for (const strategyId of record.selectedStrategies) {
      if (!strategyEffectiveness[strategyId]) {
        strategyEffectiveness[strategyId] = { used: 0, totalDamage: 0 };
      }
      strategyEffectiveness[strategyId].used++;
      strategyEffectiveness[strategyId].totalDamage += record.finalDamage;
    }
  }

  let bestStrategy = 'insurance';
  let lowestAvgDamage = Infinity;

  for (const [strategyId, data] of Object.entries(strategyEffectiveness)) {
    if (data.used >= 1) {
      const avgDamage = data.totalDamage / data.used;
      if (avgDamage < lowestAvgDamage) {
        lowestAvgDamage = avgDamage;
        bestStrategy = strategyId;
      }
    }
  }

  const mostCommonType = (Object.entries(eventsByType) as [DisasterType, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'kiln_explosion';

  const totalItemsAtRisk = totalItemsLost + history.reduce((sum, r) => sum + r.itemsSaved, 0);
  const survivalRate = totalItemsAtRisk > 0 ? ((totalItemsAtRisk - totalItemsLost) / totalItemsAtRisk) * 100 : 100;

  const insights: string[] = [];

  if (totalEvents >= 3) {
    insights.push(`共经历 ${totalEvents} 次灾难事件，平均每次损失 ${Math.round(totalDamage / totalEvents)} 点。`);
  }

  if (eventsByType.war_looting > eventsByType.kiln_explosion &&
      eventsByType.war_looting > eventsByType.transport_damage &&
      eventsByType.war_looting > eventsByType.shipwreck) {
    insights.push('战争劫掠是最频繁的灾害类型，建议加强防御工事和转移预案。');
  }

  if (eventsByType.shipwreck > 0 && eventsByType.shipwreck === totalEvents) {
    insights.push('海运风险频发，考虑增加陆路运输比例或加强船舶安全措施。');
  }

  if (survivalRate < 50) {
    insights.push('当前保存率较低，建议增加减灾策略投资，提高抗风险能力。');
  } else if (survivalRate >= 80) {
    insights.push('保存率优异！当前的减灾策略组合效果显著。');
  }

  if (totalValueLost > 100000) {
    insights.push('累计经济损失较大，建议设立专项风险准备金。');
  }

  const strategyInfo = mitigationStrategies.find((s) => s.id === bestStrategy);
  if (strategyInfo) {
    insights.push(`"${strategyInfo.name}"是最有效的减灾策略，建议优先配置。`);
  }

  if (insights.length === 0) {
    insights.push('继续积累更多数据，以便生成更深入的分析洞察。');
  }

  return {
    totalEvents,
    eventsByType,
    totalDamage,
    totalItemsLost,
    totalValueLost,
    averageDamagePerEvent: totalEvents > 0 ? Math.round(totalDamage / totalEvents) : 0,
    bestStrategy,
    worstEvent,
    mostCommonType,
    survivalRate,
    insights,
  };
};

export const disasterTypeNames: Record<DisasterType, string> = {
  kiln_explosion: '窑炉爆裂',
  transport_damage: '运输损坏',
  war_looting: '战争掠夺',
  shipwreck: '沉船事故',
};

export const severityNames: Record<DisasterSeverity, string> = {
  minor: '轻微',
  moderate: '中等',
  severe: '严重',
  catastrophic: '灾难性',
};

export const severityColors: Record<DisasterSeverity, string> = {
  minor: '#8BA888',
  moderate: '#C9A962',
  severe: '#A83232',
  catastrophic: '#8B0000',
};
